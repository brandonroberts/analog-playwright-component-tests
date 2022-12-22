/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { reflectComponentType } from '@angular/core';

// @ts-check
// This file is injected into the registry as text, no dependencies are allowed.

import 'zone.js/dist/zone.js';
import { reflectComponentType, Type } from '@angular/core';
import { NgZone, createComponent } from '@angular/core';
import { createApplication } from '@angular/platform-browser';


/** @type {Map<string, Type<any>>} */
const registry = new Map();

/**
 * @param {{[key: string]: Type<any>}} components
 */
export function register(components) {
  for (const [name, value] of Object.entries(components))
    registry.set(name, value);
}

/**
 * @param {Type<any>} component
 */
function render(component) {
  let componentFunc = registry.get(component.type);
  if (!componentFunc) {
    // Lookup by shorthand.
    for (const [name, value] of registry) {
      if (component.type.endsWith(`_${name}`)) {
        componentFunc = value;
        break;
      }
    }
  }

  if (!componentFunc && component.type[0].toUpperCase() === component.type[0])
    throw new Error(`Unregistered component: ${component.type}. Following components are registered: ${[...registry.keys()]}`);

  const ngComponent = reflectComponentType(componentFunc);

  if (!ngComponent || !ngComponent.isStandalone) {
    throw new Error('Only standalone components are supported');
  }

  return createApplication().then((appRef) => {
    const zone = appRef.injector.get(NgZone);
    zone.run(() => {
      const componentRef = createComponent(Component, {
        environmentInjector: appRef.injector,
        hostElement: element,
      });

      appRef.attachView(componentRef.hostView);
    });
  });
}

window.playwrightMount = async (component, rootElement, hooksConfig) => {
  for (const hook of /** @type {any} */(window).__pw_hooks_before_mount || [])
    await hook({ hooksConfig });

  await render(component);

  for (const hook of /** @type {any} */(window).__pw_hooks_after_mount || [])
    await hook({ hooksConfig });
};

window.playwrightUnmount = async rootElement => {
  console.log(rootElement);
  // if (!ReactDOM.unmountComponentAtNode(rootElement))
    // throw new Error('Component was not mounted');
};

window.playwrightUpdate = async (rootElement, component) => {
  console.log(rootElement, component);
  // ReactDOM.render(render(/** @type {Component} */(component)), rootElement);
};
