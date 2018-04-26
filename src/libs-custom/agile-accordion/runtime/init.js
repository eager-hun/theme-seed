
export default function(Vue, vueComponents) {
  const agileAccordionElements = document.querySelectorAll('.agile-accordion-runtime');

  let element;

  for (var i = 0; i < agileAccordionElements.length; i++) {
    element = agileAccordionElements[i];

    new Vue({
      el: element,
      render: h => h(vueComponents.agileAccordionRuntime, {
        props: {
          items: element.dataset.items ? JSON.parse(element.dataset.items) : undefined,
          settings: element.dataset.settings ? JSON.parse(element.dataset.settings) : undefined,
        }
      })
    });
  }
}
