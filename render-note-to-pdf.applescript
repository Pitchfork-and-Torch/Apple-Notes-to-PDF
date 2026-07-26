-- render-note-to-pdf.applescript
-- Apple Notes to PDF v7 — HTML → PDF via NSAttributedString (AppKit print-to-PDF)
-- No UI scripting. Works offline.
--
-- Usage:
--   osascript render-note-to-pdf.applescript /path/in.html /path/out.pdf

use AppleScript version "2.4"
use scripting additions
use framework "Foundation"
use framework "AppKit"

on run argv
	if (count of argv) < 2 then
		error "Usage: osascript render-note-to-pdf.applescript INPUT_HTML_PATH OUTPUT_PDF_PATH"
	end if
	
	set inputHTMLPath to (item 1 of argv) as text
	set outputPDFPath to (item 2 of argv) as text
	
	-- Ensure parent directory exists
	do shell script "mkdir -p " & quoted form of (do shell script "dirname " & quoted form of outputPDFPath)
	
	-- Read HTML via Foundation (UTF-8 safe)
	set htmlNS to current application's NSString's stringWithContentsOfFile:inputHTMLPath encoding:(current application's NSUTF8StringEncoding) |error|:(missing value)
	if htmlNS is missing value then
		-- Fallback shell cat
		set htmlString to do shell script "cat " & quoted form of inputHTMLPath
		set htmlNS to current application's NSString's stringWithString:htmlString
	end if
	
	set theData to htmlNS's dataUsingEncoding:(current application's NSUTF8StringEncoding)
	
	-- Prefer NSHTMLTextDocumentType import for richer CSS handling
	set NSDictionary to current application's NSDictionary
	set docAttrs to NSDictionary's dictionaryWithObject:(current application's NSHTMLTextDocumentType) forKey:(current application's NSDocumentTypeDocumentAttribute)
	set {styledText, docOut} to current application's NSAttributedString's alloc()'s initWithData:theData options:docAttrs documentAttributes:(reference) |error|:(missing value)
	
	if styledText is missing value then
		set styledText to (current application's NSAttributedString's alloc()'s initWithHTML:theData documentAttributes:(missing value))
	end if
	if styledText is missing value then
		error "Could not parse HTML into NSAttributedString: " & inputHTMLPath
	end if
	
	my saveStyledText:styledText asPDFToFile:outputPDFPath
end run

on saveStyledText:styledText asPDFToFile:newPath
	set NSAutoPagination to 0
	set NSClipPagination to 2
	set NSPrintJobSavingURL to current application's NSPrintJobSavingURL
	set NSPrintOperation to current application's NSPrintOperation
	set NSPrintSaveJob to current application's NSPrintSaveJob
	set NSURL to current application's NSURL
	set NSPrintInfo to current application's NSPrintInfo
	set NSTextView to current application's NSTextView
	set NSDictionary to current application's NSDictionary
	set NSThread to current application's NSThread
	set NSFont to current application's NSFont
	
	set destURL to NSURL's fileURLWithPath:newPath
	set printInfo to NSPrintInfo's alloc()'s initWithDictionary:(NSDictionary's dictionaryWithObject:destURL forKey:NSPrintJobSavingURL)
	printInfo's setJobDisposition:NSPrintSaveJob
	printInfo's setHorizontalPagination:NSClipPagination
	printInfo's setVerticalPagination:NSAutoPagination
	printInfo's setHorizontallyCentered:false
	printInfo's setVerticallyCentered:false
	
	-- Comfortable margins (points; 72pt ≈ 1 inch)
	try
		printInfo's setLeftMargin:54
		printInfo's setRightMargin:54
		printInfo's setTopMargin:54
		printInfo's setBottomMargin:54
	end try
	
	set pageSize to printInfo's paperSize()
	set theLeft to printInfo's leftMargin()
	set theRight to printInfo's rightMargin()
	set contentWidth to (pageSize's width) - theLeft - theRight
	
	set theView to NSTextView's alloc()'s initWithFrame:{{0, 0}, {contentWidth, 3.0E+38}}
	theView's setHorizontallyResizable:false
	theView's setVerticallyResizable:true
	try
		theView's setFont:(NSFont's systemFontOfSize:11)
	end try
	theView's textStorage()'s setAttributedString:styledText
	
	if NSThread's isMainThread() then
		theView's sizeToFit()
	else
		theView's performSelectorOnMainThread:"sizeToFit" withObject:(missing value) waitUntilDone:true
	end if
	
	set printOp to NSPrintOperation's printOperationWithView:theView printInfo:printInfo
	printOp's setShowsPrintPanel:false
	printOp's setShowsProgressPanel:false
	
	if NSThread's isMainThread() then
		printOp's runOperation()
	else
		my performSelectorOnMainThread:"runPrintOperation:" withObject:printOp waitUntilDone:true
	end if
end saveStyledText:asPDFToFile:

on runPrintOperation:printOp
	printOp's runOperation()
end runPrintOperation:
