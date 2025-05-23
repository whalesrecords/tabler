---
title: Page layouts
summary: Learn how to build a sample version of the dashboard
description: Learn to design dashboard layouts.
---

{% callout %}
   Before you start with this section, make sure you have followed the [installation guideline](/ui/getting-started/installation). 
{% endcallout %}

## Sample layout

To create a sample version of the dashboard, you can use the following code snippet. This code snippet will help you to create a dashboard layout with a header.

{% capture html -%}
<div class="page">
  <header class="navbar navbar-expand-sm navbar-light d-print-none">
    <div class="container-xl">
      <h1 class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
        <a href="#">
          <img
            src="/static/logo.svg"
            width="110"
            height="32"
            alt="Tabler"
            class="navbar-brand-image"
          />
        </a>
      </h1>
      <div class="navbar-nav flex-row order-md-last">
        <div class="nav-item">
          <a href="#" class="nav-link d-flex lh-1 text-reset p-0">
            <span
              class="avatar avatar-sm"
              style="background-image: url(/static/avatars/002m.jpg)"
            ></span>
            <div class="d-none d-xl-block ps-2">
              <div>Paweł Kuna</div>
              <div class="mt-1 small text-secondary">UI Designer</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </header>
  <div class="page-wrapper">
    <div class="page-body">
      <div class="container-xl">
        <div class="row row-deck row-cards">
          <div class="col-4">
            <div class="card">
              <div class="card-body" style="height: 10rem"></div>
            </div>
          </div>
          <div class="col-4">
            <div class="card">
              <div class="card-body" style="height: 10rem"></div>
            </div>
          </div>
          <div class="col-4">
            <div class="card">
              <div class="card-body" style="height: 10rem"></div>
            </div>
          </div>
          <div class="col-12">
            <div class="card">
              <div class="card-body" style="height: 10rem"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
{%- endcapture %}
{% include "docs/example.html" html=html raw %}

## Sidebar layout

To create a sidebar layout, you can use the following code snippet. This code snippet will help you to create a sidebar layout with a header.

{% capture html -%}
<div class="page">
  <!-- Sidebar -->
  <aside class="navbar navbar-vertical navbar-expand-sm position-absolute" data-bs-theme="dark">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button">
        <span class="navbar-toggler-icon"></span>
      </button>
      <h1 class="navbar-brand navbar-brand-autodark">
        <a href="#">
          <img
            src="/static/logo-white.svg"
            width="110"
            height="32"
            alt="Tabler"
            class="navbar-brand-image"
          />
        </a>
      </h1>
      <div class="collapse navbar-collapse" id="sidebar-menu">
        <ul class="navbar-nav pt-lg-3">
          <li class="nav-item">
            <a class="nav-link" href="./">
              <span class="nav-link-title"> Home </span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <span class="nav-link-title"> Link 1 </span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <span class="nav-link-title"> Link 2 </span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <span class="nav-link-title"> Link 3 </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </aside>
  <div class="page-wrapper">
    <div class="page-header d-print-none">
      <div class="container-xl">
        <div class="row g-2 align-items-center">
          <div class="col">
            <h2 class="page-title">Vertical layout</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="page-body">
      <div class="container-xl">
        <div class="row row-deck row-cards">
          <div class="col-sm-6 col-lg-3">
            <div class="card">
              <div class="card-body" style="height: 10rem"></div>
            </div>
          </div>
          <div class="col-sm-6 col-lg-3">
            <div class="card">
              <div class="card-body" style="height: 10rem"></div>
            </div>
          </div>
          <div class="col-sm-6 col-lg-3">
            <div class="card">
              <div class="card-body" style="height: 10rem"></div>
            </div>
          </div>
          <div class="col-sm-6 col-lg-3">
            <div class="card">
              <div class="card-body" style="height: 10rem"></div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="row row-cards">
              <div class="col-12">
                <div class="card">
                  <div class="card-body" style="height: 10rem"></div>
                </div>
              </div>
              <div class="col-12">
                <div class="card">
                  <div class="card-body" style="height: 10rem"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="card">
              <div class="card-body" style="height: 10rem"></div>
            </div>
          </div>
          <div class="col-12">
            <div class="card">
              <div class="card-body" style="height: 10rem"></div>
            </div>
          </div>
          <div class="col-md-12 col-lg-8">
            <div class="card">
              <div class="card-body" style="height: 10rem"></div>
            </div>
          </div>
          <div class="col-md-6 col-lg-4">
            <div class="card">
              <div class="card-body" style="height: 10rem"></div>
            </div>
          </div>
          <div class="col-md-6 col-lg-4">
            <div class="card">
              <div class="card-body" style="height: 10rem"></div>
            </div>
          </div>
          <div class="col-md-12 col-lg-8">
            <div class="card">
              <div class="card-body" style="height: 10rem"></div>
            </div>
          </div>
          <div class="col-12">
            <div class="card">
              <div class="card-body" style="height: 10rem"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
{%- endcapture %}
{% include "docs/example.html" html=html raw %}