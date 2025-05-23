---
title: Tables
summary: Tables are useful interface elements that allow you to visualize data and arrange it in a clear way. Thanks to that, users can browse a lot of information at once and a good table design will help you take care of its clarity.
bootstrapLink: content/tables/
description: Visualize data clearly with tables.
---

## Basic Table

The basic table design has light padding and the presented data is separated with horizontal dividers. It helps provide users with all the necessary information, without overwhelming them with visuals.

The `.table` class adds basic styling to a table:

{% capture html -%}
<div class="table-responsive">
  <table class="table table-vcenter">
    <thead>
      <tr>
        <th>Name</th>
        <th>Title</th>
        <th>Email</th>
        <th>Role</th>
        <th class="w-1"></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Paweł Kuna</td>
        <td class="text-secondary">UI Designer, Training</td>
        <td class="text-secondary">
          <a href="#" class="text-reset">paweluna@howstuffworks.com</a>
        </td>
        <td class="text-secondary">User</td>
        <td>
          <a href="#">Edit</a>
        </td>
      </tr>
      <tr>
        <td>Jeffie Lewzey</td>
        <td class="text-secondary">Chemical Engineer, Support</td>
        <td class="text-secondary">
          <a href="#" class="text-reset">jlewzey1@seesaa.net</a>
        </td>
        <td class="text-secondary">Admin</td>
        <td>
          <a href="#">Edit</a>
        </td>
      </tr>
      <tr>
        <td>Mallory Hulme</td>
        <td class="text-secondary">Geologist IV, Support</td>
        <td class="text-secondary">
          <a href="#" class="text-reset">mhulme2@domainmarket.com</a>
        </td>
        <td class="text-secondary">User</td>
        <td>
          <a href="#">Edit</a>
        </td>
      </tr>
      <tr>
        <td>Dunn Slane</td>
        <td class="text-secondary">Research Nurse, Sales</td>
        <td class="text-secondary">
          <a href="#" class="text-reset">dslane3@epa.gov</a>
        </td>
        <td class="text-secondary">Owner</td>
        <td>
          <a href="#">Edit</a>
        </td>
      </tr>
      <tr>
        <td>Emmy Levet</td>
        <td class="text-secondary">VP Product Management, Accounting</td>
        <td class="text-secondary">
          <a href="#" class="text-reset">elevet4@senate.gov</a>
        </td>
        <td class="text-secondary">Admin</td>
        <td>
          <a href="#">Edit</a>
        </td>
      </tr>
    </tbody>
  </table>
</div>
{%- endcapture %}
{% include "docs/example.html" html=html %}

## Responsive tables

Use the `.table-responsive` class across each breakpoint for horizontal scrolling tables. If you want to create responsive tables up to a specific breakpoint, use `.table-responsive{-sm|-md|-lg|-xl}`. From that breakpoint and up, the table will behave normally, rather than scroll horizontally.

{% capture html -%}
<table class="table table-responsive">
  <thead>
    <tr>
      <th>#</th>
      <th class="text-nowrap">Heading 1</th>
      <th class="text-nowrap">Heading 2</th>
      <th class="text-nowrap">Heading 3</th>
      <th class="text-nowrap">Heading 4</th>
      <th class="text-nowrap">Heading 5</th>
      <th class="text-nowrap">Heading 6</th>
      <th class="text-nowrap">Heading 7</th>
      <th class="text-nowrap">Heading 8</th>
      <th class="text-nowrap">Heading 9</th>
      <th class="text-nowrap">Heading 10</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1</th>
      <td>Cell</td>
      <td>Cell</td>
      <td>Cell</td>
      <td>Cell</td>
      <td>Cell</td>
      <td>Cell</td>
      <td>Cell</td>
      <td>Cell</td>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Cell</td>
      <td>Cell</td>
      <td>Cell</td>
      <td>Cell</td>
      <td>Cell</td>
      <td>Cell</td>
      <td>Cell</td>
      <td>Cell</td>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
  </tbody>
</table>
{%- endcapture %}
{% include "docs/example.html" html=html %}

## No wrap

If you don't want the table cell content to wrap to another line, use the `table-nowrap` class.

{% capture html -%}
<div class="table-responsive">
  <table class="table table-vcenter table-nowrap">
    <thead>
      <tr>
        <th>Name</th>
        <th>Title</th>
        <th>Email</th>
        <th>Role</th>
        <th></th>
        <th class="w-1"></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Paweł Kuna</td>
        <td class="text-secondary">UI Designer, Training</td>
        <td class="text-secondary">
          <a href="#" class="text-reset">paweluna@howstuffworks.com</a>
        </td>
        <td class="text-secondary">User</td>
        <td>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, commodi cupiditate
          debitis deserunt expedita hic incidunt iste modi molestiae nesciunt non nostrum
          perferendis perspiciatis placeat praesentium quaerat quo repellendus, voluptates.
        </td>
        <td>
          <a href="#">Edit</a>
        </td>
      </tr>
    </tbody>
  </table>
</div>
{%- endcapture %}
{% include "docs/example.html" html=html %}

## Table Variants

{% capture html -%}
<table class="table">
  <thead>
    <tr>
      <th scope="col">Class</th>
      <th scope="col">Heading</th>
      <th scope="col">Heading</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Default</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr class="table-primary">
      <th scope="row">Primary</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr class="table-secondary">
      <th scope="row">Secondary</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr class="table-success">
      <th scope="row">Success</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr class="table-danger">
      <th scope="row">Danger</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr class="table-warning">
      <th scope="row">Warning</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr class="table-info">
      <th scope="row">Info</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr class="table-light">
      <th scope="row">Light</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr class="table-dark">
      <th scope="row">Dark</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
  </tbody>
</table>
{%- endcapture %}
{% include "docs/example.html" html=html %}

## Table with sticky header

{% capture html -%}
<table class="table">
  <thead class="sticky-top">
    <tr>
      <th scope="col">Class</th>
      <th scope="col">Heading</th>
      <th scope="col">Heading</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Default</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr>
      <th scope="row">Primary</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr>
      <th scope="row">Secondary</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr>
      <th scope="row">Success</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr>
      <th scope="row">Danger</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr>
      <th scope="row">Warning</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr>
      <th scope="row">Info</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr>
      <th scope="row">Light</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr class="table-dark">
      <th scope="row">Dark</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr>
      <th scope="row">Default</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr>
      <th scope="row">Primary</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr>
      <th scope="row">Secondary</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr>
      <th scope="row">Success</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr>
      <th scope="row">Danger</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr>
      <th scope="row">Warning</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr>
      <th scope="row">Info</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr>
      <th scope="row">Light</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
    <tr class="table-dark">
      <th scope="row">Dark</th>
      <td>Cell</td>
      <td>Cell</td>
    </tr>
  </tbody>
</table>
{%- endcapture %}
{% include "docs/example.html" html=html height="42rem" %}
