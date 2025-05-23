---
title: Image check
summary: The image check is a great way to make your form more user-friendly and engaging. You can use the image check to create a visually appealing form that will help users make decisions quickly and easily.
description: Add visual appeal to forms with images.
---

## Default markup

To build an image check, you need to use the `.form-imagecheck` class and the `.form-imagecheck-input` class for the input element. You can also use the `.form-imagecheck-figure` class to display the custom checkbox and the `.form-imagecheck-image` class to style the image itself.

```html
<label class="form-imagecheck">
  <input name="..." type="checkbox" value="" class="form-imagecheck-input" checked />
  <span class="form-imagecheck-figure">
    <img src="..." alt="" class="form-imagecheck-image" />
  </span>
</label>
```

Look at the examples below to see how the image check works:

{% capture html -%}
<div class="mb-3">
  <label class="form-label">Image Check</label>
  <div class="row g-2">
    <div class="col-3">
      <label class="form-imagecheck">
        <input name="image" type="checkbox" value="1" class="form-imagecheck-input" />
        <span class="form-imagecheck-figure">
          <img
            src="/static/photos/everything-you-need-to-work-from-your-bed-2.jpg"
            alt=""
            class="form-imagecheck-image"
          />
        </span>
      </label>
    </div>
    <div class="col-3">
      <label class="form-imagecheck">
        <input name="image" type="checkbox" value="2" class="form-imagecheck-input" checked />
        <span class="form-imagecheck-figure">
          <img
            src="/static/photos/color-palette-guide-sample-colors-catalog-.jpg"
            alt=""
            class="form-imagecheck-image"
          />
        </span>
      </label>
    </div>
    <div class="col-3">
      <label class="form-imagecheck">
        <input name="image" type="checkbox" value="3" class="form-imagecheck-input" />
        <span class="form-imagecheck-figure">
          <img
            src="/static/photos/woman-read-book-and-drink-coffee-2.jpg"
            alt=""
            class="form-imagecheck-image"
          />
        </span>
      </label>
    </div>
    <div class="col-3">
      <label class="form-imagecheck">
        <input name="image" type="checkbox" value="4" class="form-imagecheck-input" checked />
        <span class="form-imagecheck-figure">
          <img
            src="/static/photos/stylish-workspace-with-macbook-pro-2.jpg"
            alt=""
            class="form-imagecheck-image"
          />
        </span>
      </label>
    </div>
  </div>
</div>
{%- endcapture %}
{% include "docs/example.html" html=html %}

## Radio buttons

If you want to use the image check as a radio button, you can change the input type to `radio`. 

{% capture html -%}
<div class="mb-3">
  <label class="form-label">Image Check Radio</label>
  <div class="row g-2">
    <div class="col-3">
      <label class="form-imagecheck mb-2">
        <input name="image" type="radio" value="1" class="form-imagecheck-input" />
        <span class="form-imagecheck-figure">
          <img
            src="/static/photos/woman-drinking-hot-tea-in-her-home-office.jpg"
            alt=""
            class="form-imagecheck-image"
          />
        </span>
      </label>
    </div>
    <div class="col-3">
      <label class="form-imagecheck mb-2">
        <input name="image" type="radio" value="2" class="form-imagecheck-input" checked />
        <span class="form-imagecheck-figure">
          <img
            src="/static/photos/young-woman-sitting-on-the-sofa-and-working-on-her-laptop-3.jpg"
            alt=""
            class="form-imagecheck-image"
          />
        </span>
      </label>
    </div>
    <div class="col-3">
      <label class="form-imagecheck mb-2">
        <input name="image" type="radio" value="3" class="form-imagecheck-input" />
        <span class="form-imagecheck-figure">
          <img
            src="/static/photos/beautiful-blonde-woman-relaxing-with-a-can-of-coke-on-a-tree-stump-by-the-beach.jpg"
            alt=""
            class="form-imagecheck-image"
          />
        </span>
      </label>
    </div>
    <div class="col-3">
      <label class="form-imagecheck mb-2">
        <input name="image" type="radio" value="4" class="form-imagecheck-input" checked />
        <span class="form-imagecheck-figure">
          <img src="/static/photos/book-on-the-grass.jpg" alt="" class="form-imagecheck-image" />
        </span>
      </label>
    </div>
  </div>
</div>
{%- endcapture %}
{% include "docs/example.html" html=html %}

## Avatars

If you want to use the image check with avatars, you can use an [avatar component](/ui/components/avatars) instead of an image.

{% capture html -%}
<div class="mb-3">
  <label class="form-label">Person Check</label>
  <div class="row g-2">
    <div class="col-auto">
      <label class="form-imagecheck mb-2">
        <input name="image" type="checkbox" value="1" class="form-imagecheck-input" />
        <span class="form-imagecheck-figure">
          <span class="form-imagecheck-image">
            <span
              class="avatar avatar-xl"
              style="background-image: url(/static/avatars/057f.jpg)"
            ></span>
          </span>
        </span>
      </label>
    </div>
    <div class="col-auto">
      <label class="form-imagecheck mb-2">
        <input name="image" type="checkbox" value="2" class="form-imagecheck-input" checked />
        <span class="form-imagecheck-figure">
          <span class="form-imagecheck-image">
            <span class="avatar avatar-xl">HS</span>
          </span>
        </span>
      </label>
    </div>
    <div class="col-auto">
      <label class="form-imagecheck mb-2">
        <input name="image" type="checkbox" value="3" class="form-imagecheck-input" />
        <span class="form-imagecheck-figure">
          <span class="form-imagecheck-image">
            <span
              class="avatar avatar-xl"
              style="background-image: url(/static/avatars/062m.jpg)"
            ></span>
          </span>
        </span>
      </label>
    </div>
    <div class="col-auto">
      <label class="form-imagecheck mb-2">
        <input name="image" type="checkbox" value="4" class="form-imagecheck-input" checked />
        <span class="form-imagecheck-figure">
          <span class="form-imagecheck-image">
            <span
              class="avatar avatar-xl"
              style="background-image: url(/static/avatars/070m.jpg)"
            ></span>
          </span>
        </span>
      </label>
    </div>
  </div>
</div>
{%- endcapture %}
{% include "docs/example.html" html=html %}
