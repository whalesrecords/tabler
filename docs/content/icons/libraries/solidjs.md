---
title: SolidJS
description: Tabler Icons library for SolidJS framework.
summary: Tabler Icons for SolidJS is a lightweight library offering a vast selection of high-quality icons. It is designed for seamless integration with SolidJS, enabling developers to build visually appealing interfaces.
---

![](/img/icons/package-solidjs.png)


## Installation

{% include "docs/tabs-package.html" name="@tabler/icons-solidjs" %}

or just [download from Github](https://github.com/tabler/tabler-icons/releases).

## How to use

It's built with ESmodules so it's completely tree-shakable. Each icon can be imported as a component.

```js
import { IconArrowRight } from '@tabler/icons-solidjs';

const App = () => {
  return <IconArrowRight />;
};

export default App;
```

You can pass additional props to adjust the icon.

```js
<IconArrowRight color="red" size={48} />
```

### Props

| name          | type     | default      |
| ------------- | -------- | ------------ |
| `size`        | _Number_ | 24           |
| `color`       | _String_ | currentColor |
| `stroke`      | _Number_ | 2            |
