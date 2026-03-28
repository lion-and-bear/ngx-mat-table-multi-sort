# ngx-mat-table-multi-sort

An Angular library that adds multi-sort capability to the Angular Material table.

[![Continuous Integration](https://github.com/lion-and-bear/ngx-mat-table-multi-sort/actions/workflows/ci.yml/badge.svg)](https://github.com/lion-and-bear/ngx-mat-table-multi-sort/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/lion-and-bear/ngx-mat-table-multi-sort/graph/badge.svg?token=MDIEOFNUYR)](https://codecov.io/gh/lion-and-bear/ngx-mat-table-multi-sort)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ngx-mat-table-multi-sort&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ngx-mat-table-multi-sort)
![Dependencies](https://img.shields.io/librariesio/release/npm/ngx-mat-table-multi-sort)
![npm](https://img.shields.io/npm/v/ngx-mat-table-multi-sort)
![License](https://img.shields.io/github/license/lion-and-bear/ngx-mat-table-multi-sort)

## Features

- Extend the Angular Material Table to support multiple sorting
- Extend the Angular Material Table to allow the user to re-order columns and toggle their visibility.
- Support persisting the configuration in local, session or custom storage implementations.
- Supports all actively supported versions of Angular. Currently that is versions 19, 20 and 21.
- Batteries included: The repository contains a demo application that can help you integrate the library with your project
- 100% covered by automated unit tests and secured by static code analysis

## How to use this library

**Prerequisite:** You have created an application using a supported version of Angular and Angular Material

1. In your Angular application run `pnpm install ngx-mat-table-multi-sort` to add the library to your dependencies
1. As this library is using Material, add the following to the `head` element of your `index.html`:

```html
<link
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
  rel="stylesheet" />
```

Alternatively, you can also add the following to your `angular.json`:

```json
"styles": [
  ...
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  ...
]
```

3. In the template, replace the `matSort` directive with the `matMultiSort` directive.
1. Also replace the `mat-sort-header` directive with the `mat-multi-sort-header` directive in the column definitions.
1. In the component definition use `MatMultiSortTableDataSource<T>` as your datasource type instead of `MatTableDataSource<T>`.
1. Also change the type of the sorter from `MatSort` to `MatMultiSortDirective`
1. If you are using standalone components, add the `MatMultiSortDirective` and `MatMultiSortHeaderComponent` to your component's imports array. Otherwise add them to the NgModule that declares your component.
1. Done! 🎉

Enjoy multi-sorting your Angular Material data table!

## Demo

The demo application is hosted on [GitHub pages](https://lion-and-bear.github.io/ngx-mat-table-multi-sort/). You can also clone the repository and run the demo locally.

1. Clone the repository to your local machine
1. Run `pnpm install` to restore the dependencies
1. Start the demo application by running `pnpm start:demo`
1. When compilation is completed, the application is running on `http://localhost:4200`

## License

The project is subject to the MIT license unless otherwise noted. A copy can be found [here](./LICENSE.md).

## Changelog

Please refer to the [changelog](./CHANGELOG.md) document or the [release notes](https://github.com/lion-and-bear/ngx-mat-table-multi-sort/releases) in GitHub.

## I found a bug, what do I do?

We are happy to hear any feedback regarding the library or its implementation, be it critizism, praise or rants. Please create a [GitHub issue](https://github.com/lion-and-bear/ngx-mat-table-multi-sort/issues) if you would like to contact us.

We would especially appreciate, if you could report any issues you encounter while using the library. Issues we know about, we can probably fix.

If you want to submit a bug report, please check if the issue you have has already been reported. If you want to contribute additional information to the issue, please add it to the existing issue instead of creating another one. Duplicate issues will take time from bugfixing and thus delay a fix.

While creating a bug report, please make it easy for us to fix it by giving us all the details you have about the issue. Always include the version of the library and a short concise description of the issue. Besides that, there are a few other pieces of information that help tracking down bugs:

- The system environment in which the issue occurred (e.g. node version)
- Some steps to reproduce the issue, e.g. a code snippet
- The expected behaviour and how the failed failed to meet that expectation
- Anything else you think we might need

## I have a feature request, what do I do?

Please create a [GitHub issue](https://github.com/lion-and-bear/ngx-mat-table-multi-sort/issues)!

## Acknowledgements

This library was inspired by the work in [ngx-multi-sort-table](https://github.com/Maxl94/ngx-multi-sort-table). While it was created from scratch and is an independent implementation tailored to specific use cases, their ideas and approach provided valuable guidance in its creation. Many thanks for their contributions to the open-source community!

<hr>

Made with ❤️ by [Michaela Andermann](https://github.com/michix99) and [Philip Gerke](https://github.com/pgerke)
