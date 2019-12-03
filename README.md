# access-control

> DEPRECATION NOTE:
> Since the time this package was created, SciSpike has been acquired by [Northscaler](https://www.northscaler.com).
> There will be no further development on this module.
> Instead, development will continue at [@northscaler/acl](https://www.npmjs.com/package/@northscaler/acl).
> You can see all of Northscaler's public Node.js modules at https://www.npmjs.com/search?q=%40northscaler.

This library allows you to maintain security information in access control lists (ACLs).
There are four elements required in the determination of access:
* __principal__:  The actor, user or system attempting to perform some action on a securable.
* __securable__:  The thing being secured or the thing access to which is being controlled.
* __action__:  The action being performed on a securable.
This library defines a minimal set of [primitive actions](src/main/PrimitiveAction.js), but you can define your own.
* __access control entry__:  the thing that binds the principal, securable and action together along with the "granted" boolean or some other strategy.
Some systems call this a "permission", a "right" or a "grant" in the granting sense, and a "denial", an "antipermission", or a "negative permission" in the denying sense.
We use a the more general term "access control entry", which can mean either a permission or a denial.

The primary export of this module is a class called `Acl`, which has interrogation methods `grants` & `denies`, as well as mutating methods like `grant`, `ungrant`, `deny` & `undeny`.

>NOTE: In this implementation, a single denial vetos any number of grants.

It supports declarative or static security (think "granted" or "denied" as a simple boolean), as well as algorithmic or dynamic security (think "granted if today is a weekday" or something like that).

## TL;DR
See the tests in [`src/test/unit/Acl.spec.js`](src/test/unit/Acl.spec.js) for usage.

## TODO
Provide more content.
