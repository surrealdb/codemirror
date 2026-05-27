import { styleTags, tags as t } from "@lezer/highlight";

/** styleTags keyed by Lezer node names (PascalCase from tree-sitter types). */
export const surqlHighlighting = styleTags({
	Identifier: t.name,
	"KeywordFunction KeywordFunctionName": t.definitionKeyword,
	"ObjectKey!": t.propertyName,
	String: t.string,
	FormatString: t.special(t.string),
	"Int Float Decimal VersionNumber Duration": t.number,
	Bool: t.bool,
	Comment: t.lineComment,
	BlockComment: t.blockComment,
	VariableName: t.variableName,
	None: t.null,
	"FunctionName FunctionCall RecordId RecordIdIdent BuiltinFunctionName": t.function(t.name),
	", |": t.separator,
	"[ ]": t.squareBracket,
	"< >": t.angleBracket,
	"BraceOpen BraceClose": t.brace,
	"Closure Pipe": t.bracket,
	TypeName: t.typeName,
	SyntaxDescribe: t.typeName,
	"Distance Filter Tokenizer Literal IndexTypeClause AnalyzerTokenizer TokenType HttpMethod":
		t.literal,
	"RecordTbIdent RecordIdIdent RecordIdString": t.className,
	"Operator RangeOp LookupLeft LookupRight LookupBoth": t.operator,
	Regex: t.regexp,
	Keyword: t.keyword,
	"KeywordSelect KeywordFrom KeywordWhere KeywordDefine KeywordCreate KeywordUpdate KeywordDelete":
		t.keyword,
});
