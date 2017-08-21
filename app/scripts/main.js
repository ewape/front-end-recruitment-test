/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */

(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function() {
        // updatefound is also fired the very first time the SW is installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (navigator.serviceWorker.controller) {
          // The updatefound event implies that registration.installing is set:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          var installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                                'service worker became redundant.');

              default:
                // Ignore
            }
          };
        }
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  }

  // Your custom JavaScript goes here

  const app = {} || app;

  app.cloneBacon = (() => {
    const button = document.getElementById('more-bacon');
    const bacon = document.querySelector('.bacon-img');
    const container = bacon ? bacon.parentNode : false;

    const init = () => {
      if (button && bacon && container) {
        button.addEventListener('click', () => {
          let baconClone = bacon.cloneNode(true);
          container.appendChild(baconClone);
        });
      } else {
        console.error('Missing button, bacon or container element');
      }
    };

    return {
      init: init
    };
  })();

  app.formValidate = (() => {
    const formSelector = '.checkout-form';
    const inputSelector = '.form-input';
    const fieldErrorClass = 'field-error';
    const messageSelector = '.form-submit-message';
    const errorMessage = 'Please fill all required fields to place order.';
    const successMessage = 'Thank you for placing your order!';
    const formSubmittedSuccessClass = 'form-submit-success';
    const formSubmittedErrorClass = 'form-submit-error';
    const formDisabledClass = 'form-disabled';

    const form = document.querySelector(formSelector);
    const submitMessage = document.querySelector(messageSelector);

    const getFieldContainer = field => {
      return document.querySelector('[for="' + field.id + '"]').parentNode;
    };

    const showFieldError = field => {
      getFieldContainer(field).classList.add(fieldErrorClass);
    };

    const hideFieldError = field => {
      getFieldContainer(field).classList.remove(fieldErrorClass);
    };

    const fieldValid = field => {
      const isValid = field.value.trim().length > 0;

      if (isValid) {
        hideFieldError(field);
      } else {
        showFieldError(field);
      }
      return isValid;
    };

    const setFormMessage = options => {
      if (form) {
        if (submitMessage) {
          submitMessage.innerHTML = `<p>${options.message}</p>`;
          if (options.submit) {
            document.body.classList.remove(formSubmittedErrorClass);
            document.body.classList.add(formSubmittedSuccessClass);
          } else {
            document.body.classList.add(formSubmittedErrorClass);
          }
        }
      }
    };

    const disableForm = formFields => {
      if (form) {
        form.classList.add(formDisabledClass);
        if (!Array.isArray(formFields)) {
          formFields = Array.prototype.slice.call(formFields, null);
        }
        formFields.map(field => {
          field.disabled = true;
        });
      }
    };

    const formValid = () => {
      if (form) {
        const formFieldsArray = Array.prototype.slice.call((form.querySelectorAll(inputSelector)), null);
        const fieldsValid = formFieldsArray.filter(fieldValid);
        const formValid = fieldsValid.length === formFieldsArray.length;

        if (formValid) {
          disableForm(formFieldsArray);
        }

        return formValid;
      }
    };

    const formSubmit = () => {
      if (form) {
        form.addEventListener('submit', e => {
          e.preventDefault();
          const isValid = formValid();

          if (isValid) {
            setFormMessage({
              message: successMessage,
              submit: true
            });
          } else {
            setFormMessage({
              message: errorMessage,
              submit: false
            });
          }
        });
      }
    };

    const init = () => {
      formSubmit();
    };

    return {
      init: init
    };
  })();

  app.cloneBacon.init();
  app.formValidate.init();
})();
