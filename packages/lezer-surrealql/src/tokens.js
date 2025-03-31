import { ExternalTokenizer } from "@lezer/lr";

import {
	collate,
	numeric,
	_break,
	always,
	api,
	enforced,
	expunge,
	get,
	middleware,
	post,
	put,
	trace,
	_continue,
	_default,
	_delete,
	_else,
	_for,
	_if,
	_in,
	_let,
	_return,
	_throw,
	_with,
	access,
	algorithm,
	all,
	alter,
	analyzer,
	any,
	as,
	asc,
	assert,
	at,
	authenticate,
	auto,
	begin,
	bm25,
	by,
	cancel,
	capacity,
	changefeed,
	changes,
	columns,
	comment,
	commit,
	concurrently,
	config,
	content,
	create,
	database,
	db,
	define,
	desc,
	dimension,
	dist,
	doc_ids_cache,
	doc_ids_order,
	doc_lengths_cache,
	doc_lengths_order,
	drop,
	duplicate,
	duration,
	efc,
	end,
	event,
	exclude,
	exists,
	explain,
	extend_candidates,
	fetch,
	field,
	fields,
	filters,
	flexible,
	from,
	functions,
	graphql,
	group,
	highlights,
	hnsw,
	ignore,
	include,
	index,
	info,
	insert,
	into,
	issuer,
	jwt,
	keep_pruned_connections,
	key,
	kill,
	limit,
	live,
	lm,
	m,
	m0,
	merge,
	mtree_cache,
	mtree,
	namespace,
	noindex,
	normal,
	not,
	ns,
	omit,
	on,
	only,
	option,
	order,
	out,
	overwrite,
	parallel,
	param,
	passhash,
	password,
	patch,
	permissions,
	postings_cache,
	postings_order,
	readonly,
	rebuild,
	record,
	relate,
	relation,
	remove,
	replace,
	roles,
	root,
	sc,
	schemafull,
	schemaless,
	scope,
	search,
	select,
	session,
	set,
	show,
	signin,
	signup,
	since as _since,
	sleep,
	split,
	start,
	structure,
	table,
	tables,
	tb,
	tempfiles,
	terms_cache,
	terms_order,
	then,
	timeout,
	to,
	token,
	tokenizers,
	transaction,
	typeKeyword,
	unique,
	unset,
	update,
	upsert,
	url,
	use,
	user,
	valueKeyword,
	values,
	version,
	when,
	where,

	// Literals
	_false,
	_null,
	_true,
	after,
	before,
	diff,
	full,
	none,
	IndexTypeClause,
	TokenType,
	is,
	binaryOperatorKeyword,
	opIn,
	opNot,
	Distance,
	minkowski,
	Filter,
	AnalyzerTokenizer,
	_function,
	rand,
	count,
	objectOpen,

	rangeOp,
	rangeOpOpenLeft,
	rangeOpOpenRight,
	rangeOpOpenBoth
} from "./parser.terms";

const tokenMap = {
	collate,
	numeric,
	access,
	algorithm,
	all,
	alter,
	always,
	analyzer,
	any,
	api,
	as,
	asc,
	assert,
	at,
	authenticate,
	auto,
	begin,
	bm25,
	break: _break,
	by,
	cancel,
	capacity,
	changefeed,
	changes,
	columns,
	comment,
	commit,
	concurrently,
	config,
	content,
	continue: _continue,
	create,
	database,
	db,
	default: _default,
	define,
	delete: _delete,
	desc,
	dimension,
	dist,
	doc_ids_cache,
	doc_ids_order,
	doc_lengths_cache,
	doc_lengths_order,
	drop,
	duplicate,
	duration,
	efc,
	else: _else,
	end,
	enforced,
	event,
	exclude,
	exists,
	explain,
	expunge,
	extend_candidates,
	fetch,
	field,
	fields,
	filters,
	flexible,
	for: _for,
	from,
	functions,
	get,
	graphql,
	group,
	highlights,
	hnsw,
	if: _if,
	ignore,
	in: _in,
	include,
	index,
	info,
	insert,
	into,
	issuer,
	jwt,
	keep_pruned_connections,
	key,
	kill,
	let: _let,
	limit,
	live,
	lm,
	m,
	m0,
	merge,
	middleware,
	mtree_cache,
	mtree,
	namespace,
	noindex,
	normal,
	not,
	ns,
	omit,
	on,
	only,
	option,
	order,
	out,
	overwrite,
	parallel,
	param,
	passhash,
	password,
	patch,
	permissions,
	post,
	postings_cache,
	postings_order,
	put,
	readonly,
	rebuild,
	record,
	relate,
	relation,
	remove,
	replace,
	return: _return,
	roles,
	root,
	sc,
	schemafull,
	schemaless,
	scope,
	search,
	select,
	session,
	set,
	show,
	signin,
	signup,
	since: _since,
	sleep,
	split,
	start,
	structure,
	table,
	tables,
	tb,
	tempfiles,
	terms_cache,
	terms_order,
	then,
	throw: _throw,
	timeout,
	to,
	token,
	tokenizers,
	trace,
	transaction,
	type: typeKeyword,
	unique,
	unset,
	update,
	upsert,
	url,
	use,
	user,
	value: valueKeyword,
	values,
	version,
	when,
	where,
	with: _with,

	// Literals
	after,
	before,
	diff,
	false: _false,
	full,
	none,
	null: _null,
	true: _true,

	f32: IndexTypeClause,
	f64: IndexTypeClause,
	i16: IndexTypeClause,
	i32: IndexTypeClause,
	i64: IndexTypeClause,

	jwks: TokenType,
	eddsa: TokenType,
	es256: TokenType,
	es384: TokenType,
	es512: TokenType,
	ps256: TokenType,
	ps384: TokenType,
	ps512: TokenType,
	rs256: TokenType,
	rs384: TokenType,
	rs512: TokenType,

	and: binaryOperatorKeyword,
	or: binaryOperatorKeyword,
	contains: binaryOperatorKeyword,
	containsnot: binaryOperatorKeyword,
	containsall: binaryOperatorKeyword,
	containsany: binaryOperatorKeyword,
	containsnone: binaryOperatorKeyword,
	inside: binaryOperatorKeyword, notinside: binaryOperatorKeyword,
	allinside: binaryOperatorKeyword,
	anyinside: binaryOperatorKeyword,
	noneinside: binaryOperatorKeyword,
	outside: binaryOperatorKeyword,
	intersects: binaryOperatorKeyword,
	is,

	chebyshev: Distance,
	cosine: Distance,
	euclidean: Distance,
	hamming: Distance,
	jaccard: Distance,
	manhattan: Distance,
	minkowski,
	pearson: Distance,

	ascii: Filter,
	edgengram: Filter,
	ngram: Filter,
	snowball: Filter,
	uppercase: Filter,

	blank: AnalyzerTokenizer,
	camel: AnalyzerTokenizer,
	class: AnalyzerTokenizer,
	punct: AnalyzerTokenizer,

	// Function names
	function: _function,
	rand,
	count,
};

export const tokens = function (t, stack) {
	return tokenMap[t.toLowerCase()] ?? -1;
};

function isSpace(ch) {
	return ch === 32 || ch === 9 || ch === 10 || ch === 13
}

function skipSpace(input, off) {
	for (; ;) {
		let next = input.peek(off);
		if (isSpace(next)) {
			off++;
		} else if (
			next === 35 /* '#' */ ||
			((next === 47 /* '/' */ || next === 45) /* '-' */ &&
				input.peek(off + 1) === next)
		) {
			off++;
			for (; ;) {
				let next = input.peek(off);
				if (next < 0 || next === 10 || next === 13) break;
				off++;
			}
		} else {
			return off;
		}
	}
}

function isIdentifierChar(ch) {
	return (
		ch === 95 ||
		(ch >= 65 && ch <= 90) ||
		(ch >= 97 && ch <= 122) ||
		(ch >= 48 && ch <= 57)
	);
}

function skipObjKey(input, off) {
	let first = input.peek(off);
	if (isIdentifierChar(first)) {
		do {
			off++;
		} while (isIdentifierChar(input.peek(off)));
		return off;
	} else if (first === 39 /* "'" */ || first === 34 /* '"' */) {
		for (let escaped = false; ;) {
			let next = input.peek(++off);
			if (next < 0) return off;
			if (next === first && !escaped) return off + 1;
			escaped = next === 92; /* '\\' */
		}
	}

	return null;
}

export const objectToken = new ExternalTokenizer(input => {
	if (input.next === 123 /* '{' */) {
		let off = skipSpace(input, 1);

		switch (input.peek(off)) {
			// Do we directly encounter another opening bracket?
			case 123: {
				// By not accepting the token, we indicate that the outer bracket is a block
				break;
			}

			// Is this an empty object?
			case 125: {
				input.acceptToken(objectOpen, 1);
				break;
			}

			default: {
				let key = skipObjKey(input, off);
				if (key !== null) {
					off = skipSpace(input, key);
					if (input.peek(off) === 58 /* ':' */) {
						input.acceptToken(objectOpen, 1);
					}
				}
			}
		}
	}
});

function closedRangeBefore(ch) {
	return isSpace(ch) || ch < 0 || ch === 91 /* '[' */ || ch === 44 /* ',' */ ||
		ch === 123 /* '{' */ || ch === 40 /* '(' */ || ch === 59 /* ';' */ || ch === 58 /* ':' */
}

function closedRangeAfter(ch) {
	return isSpace(ch) || ch < 0 || ch === 93 /* ']' */ || ch === 44 /* ',' */ ||
		ch === 125 /* '}' */ || ch === 41 /* ')' */ || ch === 59 /* ';' */ || ch === 58 /* ':' */
}

export const rangeOperator = new ExternalTokenizer(input => {
	if (input.next === 46 /* '.' */ && input.peek(1) === 46 ||
		input.next === 62 /* '>' */ && input.peek(1) === 46 && input.peek(1) === 46) {
		let inclStart = input.next !== 62
		let closedBefore = closedRangeBefore(input.peek(-1))
		if (!inclStart && closedBefore) return
		input.advance(inclStart ? 2 : 3)
		let inclEnd = input.next === 61 /* '=' */
		if (inclEnd) input.advance()
		let closedAfter = closedRangeAfter(input.next) || input.next < 0
		if (inclEnd && closedAfter) return
		input.acceptToken(closedBefore && closedAfter ? rangeOpOpenBoth
			: closedBefore ? rangeOpOpenLeft
				: closedAfter ? rangeOpOpenRight : rangeOp)
	}
})
