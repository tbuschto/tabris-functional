# Plain JavaScript Functional Components in Tabris.js

> [View the Examples](./src/app.js)

> [Run in GitPod](https://gitpod.io/#https://github.com/tbuschto/tabris-functional)

The UI of a Tabris.js application is typically composed of standard built-in (native) [widgets](https://docs.tabris.com/latest/api/widget-overview.html) and [user-defined components](https://docs.tabris.com/latest/widget-basics.html#custom-components). These components are themselves based on built-in widgets (and/or other components), and for consistency's sake their API and behavior should mimic that of standard widgets.

At the most fundamental level there are two approaches to creating such components: [Subclassing](https://docs.tabris.com/latest/widget-basics.html#custom-components) and [writing factories](https://docs.tabris.com/latest/declarative-ui.html#functional-components).

The “subclassing” way is to define a class that extends [Composite](https://docs.tabris.com/latest/api/Composite.html), [Page](https://docs.tabris.com/latest/api/Page.html), [Tab](https://docs.tabris.com/latest/api/Tab.html) or [Canvas](https://docs.tabris.com/latest/api/Canvas.html) and adds children to itself inside the constructor. We call these “custom components”, as opposed to “[custom widgets](https://docs.tabris.com/latest/custom-widgets.html)” which would use native code in addition to JavaScript or TypeScript.

The alternative are factories that produce pre-configured, built-in widgets, also known as “functional components”. Most of the time these components aren’t reactive (self-updating) as the API isn't designed for that. Everything they do has to be programmed explicitly, but it also means that they are fairly easy to understand.

Much of our API is geared towards writing subclassing custom components, mainly in [TypeScript](https://docs.tabris.com/latest/typescript.html)/[JSX](https://docs.tabris.com/latest/declarative-ui.html) using [decorators](https://docs.tabris.com/latest/databinding/index.html). We think this is the most versatile and scalable way to create Tabris.js applications, but the learning curve is comparatively steep. Also, for simpler components the resulting code would be overly verbose.

This is why today I want to focus on the opposite end of the spectrum: Easy-to-understand functional components in plain JavaScript. No classes, no JSX, no decorators and no TypeScript. The main goal is to make the UI code expressive and easy to read - which isn’t always the same as making it easy to write. This means removing as much “noise” as possible, avoiding duplication and using meaningful names.

Currently it’s not sensible to write an entire application with functional components, with the possible exception of redux-based Tabris.js apps. The reason for that is they do not yet allow an easy separation of UI code and application logic (i.e. MVC/MVP/MVVM, etc…). However this may change in the future as the related Tabris.js API evolves.

**Continue reading [here](./src/app.js) or run the code right away via [GitPod](https://gitpod.io/#https://github.com/tbuschto/tabris-functional)**
