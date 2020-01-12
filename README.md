# generator-jhipster-primeng-blueprint
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> JHipster blueprint, This blueprint generated code that uses primeng components instead of bootstrap ones

# Introduction

This is a [JHipster](https://www.jhipster.tech/) blueprint, that is meant to be used in a JHipster application.

# Prerequisites

As this is a [JHipster](https://www.jhipster.tech/) blueprint, we expect you have JHipster and its related tools already installed:

- [Installing JHipster](https://www.jhipster.tech/installation/)

# Installation

## With NPM

To install this blueprint:

```bash
npm install -g generator-jhipster-primeng-blueprint
```

To update this blueprint:

```bash
npm update -g generator-jhipster-primeng-blueprint
```

## With Yarn

To install this blueprint:

```bash
yarn global add generator-jhipster-primeng-blueprint
```

To update this blueprint:

```bash
yarn global upgrade generator-jhipster-primeng-blueprint
```

# Usage

To use this blueprint, run the below command

```bash
jhipster --blueprint primeng-blueprint
```


## Running local Blueprint version for development

During development of blueprint, please note the below steps. They are very important.

1. Link your blueprint globally 

Note: If you do not want to link the blueprint(step 3) to each project being created, use NPM instead of Yarn as yeoman doesn't seem to fetch globally linked Yarn modules. On the other hand, this means you have to use NPM in all the below steps as well.

```bash
cd primeng-blueprint
npm link
```

2. Link a development version of JHipster to your blueprint (optional: required only if you want to use a non-released JHipster version, like the master branch or your own custom fork)

You could also use Yarn for this if you prefer

```bash
cd generator-jhipster
npm link

cd primeng-blueprint
npm link generator-jhipster
```

3. Create a new folder for the app to be generated and link JHipster and your blueprint there

```bash
mkdir my-app && cd my-app

npm link generator-jhipster-primeng-blueprint
npm link generator-jhipster (Optional: Needed only if you are using a non-released JHipster version)

jhipster -d --blueprint primeng-blueprint

```

#Contribute

To make it it easy to keep up with the latest jhipster version, we have a branch jhipster-upstream with the original content of the original jhipster generator.
On each upgrade we edit the needed file and merge back into master (or feature branch).

once changes are made, `npm run test` one the project insures that application generated matches the one in the sample project 'test/samples/...'
This creates a new project under /tmp/primeng-blueprint-test we use it to run our tests:
- `npm run test` for angular unit tests (running tests on the sample filder doesn't lint well du to eslint picking up the parent project config I suppose)
- `npm run e2e` for e2e tests using an already server https://github.com/yelhouti/generator-jhipster-composite-key-server (this project supports composites keys and has the same entities...) (do nor forget to change the generated protractor.conf to use localhost:9000 instead of 8080)

Using the samples project makes this code very well suites for test driven development.

# License

Apache-2.0 © [Youssef El Houti](https://elhouti.com)


[npm-image]: https://img.shields.io/npm/v/generator-jhipster-primeng-blueprint.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-primeng-blueprint
[travis-image]: https://travis-ci.org/yelhouti/generator-jhipster-primeng-blueprint.svg?branch=master
[travis-url]: https://travis-ci.org/yelhouti/generator-jhipster-primeng-blueprint
[daviddm-image]: https://david-dm.org/yelhouti/generator-jhipster-primeng-blueprint.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/yelhouti/generator-jhipster-primeng-blueprint
