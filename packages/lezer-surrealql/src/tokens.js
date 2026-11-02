import { ExternalTokenizer } from "@lezer/lr";

import {
	_break,
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
	add,
	algorithm,
	all,
	alpha,
	alter,
	always,
	analyze,
	analyzer,
	any,
	api,
	as,
	asc,
	ascending,
	assert,
	at,
	async,
	audience,
	authenticate,
	auto,
	backend,
	batch,
	bearer,
	begin,
	bm25,
	bucket,
	by,
	cancel,
	capabilities,
	capacity,
	cascade,
	changefeed,
	changes,
	collate,
	columns,
	comment,
	commit,
	compact,
	compatibility,
	complexity,
	computed,
	concurrently,
	config,
	content,
	context,
	create,
	database,
	db,
	defer,
	define,
	definer,
	degree,
	depth,
	desc,
	descending,
	digest,
	dimension,
	diskann,
	dist,
	distance,
	distinct,
	doc_ids_cache,
	doc_ids_order,
	doc_lengths_cache,
	doc_lengths_order,
	drop,
	duplicate,
	duration,
	edges,
	efc,
	end,
	enforced,
	event,
	exclude,
	existing,
	exists,
	expired,
	explain,
	expunge,
	extend_candidates,
	extension,
	fallback,
	fetch,
	field,
	fields,
	filters,
	flexible,
	format,
	from,
	fulltext,
	functions,
	get,
	grant,
	graphql,
	graphql_alias,
	graphql_deprecated,
	group,
	hashed_vector,
	highlights,
	hnsw,
	ignore,
	include,
	index,
	info,
	inline,
	insert,
	into,
	introspection,
	invoker,
	isolation,
	issuer,
	jwt,
	keep_pruned_connections,
	key,
	kill,
	kv,
	l_build,
	level,
	lightweight,
	limit,
	live,
	lm,
	m,
	m0,
	materialize,
	max,
	maxdepth,
	merge,
	middleware,
	migrate,
	module,
	mtree_cache,
	mtree,
	namespace,
	no,
	noindex,
	normal,
	not,
	ns,
	nulls,
	numeric,
	omit,
	on,
	only,
	option,
	order,
	original,
	out,
	overwrite,
	parallel,
	param,
	passhash,
	passscram,
	password,
	patch,
	permissions,
	post,
	postings_cache,
	postings_order,
	prepare,
	purge,
	put,
	query_timeout,
	read,
	readonly,
	rebuild,
	record,
	reference,
	references,
	refresh,
	reject,
	relate,
	relation,
	remove,
	rename,
	replace,
	retry,
	revoke,
	revoked,
	roles,
	root,
	rows,
	sc,
	schemaful,
	schemafull,
	schemaless,
	scope,
	search,
	security,
	select,
	sequence,
	session,
	set,
	show,
	signatures,
	signer,
	signin,
	signup,
	since as _since,
	sleep,
	spatial,
	split,
	sql,
	staleness,
	start,
	strict,
	structure,
	system,
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
	trace,
	transaction,
	typeKeyword,
	undeclared,
	unique,
	unset,
	unsigned,
	update,
	upsert,
	url,
	use,
	user,
	using,
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
	rangeOpOpenBoth,
	Version
} from "./parser.terms";

const tokenMap = {
	access,
	add,
	algorithm,
	all,
	alpha,
	alter,
	always,
	analyze,
	analyzer,
	any,
	api,
	as,
	asc,
	ascending,
	assert,
	at,
	async,
	audience,
	authenticate,
	auto,
	backend,
	batch,
	bearer,
	begin,
	bm25,
	break: _break,
	bucket,
	by,
	cancel,
	capabilities,
	capacity,
	cascade,
	changefeed,
	changes,
	collate,
	columns,
	comment,
	commit,
	compact,
	compatibility,
	complexity,
	computed,
	concurrently,
	config,
	content,
	context,
	continue: _continue,
	create,
	database,
	db,
	default: _default,
	defer,
	define,
	definer,
	degree,
	delete: _delete,
	depth,
	desc,
	descending,
	digest,
	dimension,
	diskann,
	dist,
	distance,
	distinct,
	doc_ids_cache,
	doc_ids_order,
	doc_lengths_cache,
	doc_lengths_order,
	drop,
	duplicate,
	duration,
	edges,
	efc,
	else: _else,
	end,
	enforced,
	event,
	exclude,
	existing,
	exists,
	expired,
	explain,
	expunge,
	extend_candidates,
	extension,
	fallback,
	fetch,
	field,
	fields,
	filters,
	flexible,
	for: _for,
	format,
	from,
	fulltext,
	functions,
	get,
	grant,
	graphql,
	graphql_alias,
	graphql_deprecated,
	group,
	hashed_vector,
	highlights,
	hnsw,
	if: _if,
	ignore,
	in: _in,
	include,
	index,
	info,
	inline,
	insert,
	into,
	introspection,
	invoker,
	isolation,
	issuer,
	jwt,
	keep_pruned_connections,
	key,
	kill,
	kv,
	l_build,
	let: _let,
	level,
	lightweight,
	limit,
	live,
	lm,
	m,
	m0,
	materialize,
	max,
	maxdepth,
	merge,
	middleware,
	migrate,
	module,
	mtree_cache,
	mtree,
	namespace,
	no,
	noindex,
	normal,
	not,
	ns,
	nulls,
	numeric,
	omit,
	on,
	only,
	option,
	order,
	original,
	out,
	overwrite,
	parallel,
	param,
	passhash,
	passscram,
	password,
	patch,
	permissions,
	post,
	postings_cache,
	postings_order,
	prepare,
	purge,
	put,
	query_timeout,
	read,
	readonly,
	rebuild,
	record,
	reference,
	references,
	refresh,
	reject,
	relate,
	relation,
	remove,
	rename,
	replace,
	retry,
	return: _return,
	revoke,
	revoked,
	roles,
	root,
	rows,
	sc,
	schemaful,
	schemafull,
	schemaless,
	scope,
	search,
	security,
	select,
	sequence,
	session,
	set,
	show,
	signatures,
	signer,
	signin,
	signup,
	since: _since,
	sleep,
	spatial,
	split,
	sql,
	staleness,
	start,
	strict,
	structure,
	system,
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
	undeclared,
	unique,
	unset,
	unsigned,
	update,
	upsert,
	url,
	use,
	user,
	using,
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

	f16: IndexTypeClause,
	f32: IndexTypeClause,
	f64: IndexTypeClause,
	i8: IndexTypeClause,
	i16: IndexTypeClause,
	i32: IndexTypeClause,
	i64: IndexTypeClause,
	u8: IndexTypeClause,

	jwks: TokenType,
	eddsa: TokenType,
	es256: TokenType,
	es384: TokenType,
	es512: TokenType,
	hs256: TokenType,
	hs384: TokenType,
	hs512: TokenType,
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
	cosine_normalized: Distance,
	euclidean: Distance,
	hamming: Distance,
	inner_product: Distance,
	jaccard: Distance,
	manhattan: Distance,
	minkowski,
	pearson: Distance,

	ascii: Filter,
	edgengram: Filter,
	lowercase: Filter,
	mapper: Filter,
	ngram: Filter,
	snowball: Filter,
	uppercase: Filter,

	blank: AnalyzerTokenizer,
	camel: AnalyzerTokenizer,
	class: AnalyzerTokenizer,
	punct: AnalyzerTokenizer,
	segment: AnalyzerTokenizer,

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
		input.next === 62 /* '>' */ && input.peek(1) === 46 && input.peek(2) === 46) {
		// `...` is the flatten operator, not a range
		if (input.peek(input.next === 62 ? 3 : 2) === 46) return
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

const isDigit = ch => ch >= 48 && ch <= 57;

// A version such as `<1.2.3>` directly after a function or extension name.
// It is only lexed where the parser can shift a Version, so `a<1>b` stays two
// comparisons.
export const versionToken = new ExternalTokenizer((input, stack) => {
	if (input.next !== 60 /* '<' */ || !stack.canShift(Version)) return;
	let off = 1;
	for (let part = 0; part < 3; part++) {
		if (!isDigit(input.peek(off))) return;
		while (isDigit(input.peek(off)) || input.peek(off) === 95 /* '_' */) off++;
		if (input.peek(off) !== 46 /* '.' */ || part === 2) break;
		off++;
	}
	if (input.peek(off) !== 62 /* '>' */) return;
	input.acceptToken(Version, off + 1);
});
