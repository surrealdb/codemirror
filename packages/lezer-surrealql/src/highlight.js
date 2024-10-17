import { styleTags, tags as t } from "@lezer/highlight"

export const surqlHighlighting = styleTags({
	"Ident": t.name,
	"Keyword function": t.keyword,
	"ObjectKey!": t.propertyName,
	"String": t.string,
	"FormatString": t.special(t.string),
	"Int Float Decimal VersionNumber Duration!": t.number,
	"Bool": t.bool,
	"Comment": t.lineComment,
	"BlockComment": t.blockComment,
	"VariableName": t.variableName,
	"None": t.null,
	"FunctionName FunctionCall/RecordId/RecordIdIdent": t.function(t.name),
	", |": t.separator,
	"[ ]": t.squareBracket,
	"< >": t.angleBracket,
	"BraceOpen BraceClose": t.brace,
	"Closure/Pipe": t.bracket,
	"TypeName": t.typeName,
	"SyntaxDescribe": t.typeName,
	"Distance Filter Tokenizer Literal IndexTypeClause AnalyzerTokenizer TokenType": t.literal,
	"RecordTbIdent RecordIdIdent": t.className,
	"Operator! ArrowLeft ArrowRight ArrowBoth": t.operator,
	"Regex": t.regexp,
});
