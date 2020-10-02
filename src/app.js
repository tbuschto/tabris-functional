// eslint-disable-next-line max-len
const {TextView, contentView, NavigationView, Page, drawer, StackLayout, Stack, Row, CollectionView, Button, ImageView, TabFolder, CheckBox, Tab, Composite, TextInput, AlertDialog, WidgetCollection} = require('tabris');

const examples = MainView().appendTo(contentView);

// This is a standalone, plain JS Tabris.js app that showcases different use
// cases for functional components. Each section below contains a small snippet
// with explanatory comments. You can see them in action by sideloading this
// project in the developer app and selecting the example from the drawer.

/////////////////////
// Minimal Example //
/////////////////////

(() => {

  // By convention functional components have names start start with an upper
  // case and return a Widget instance. You may use a conventional or arrow
  // function. Arrow functions may be shorter, but conventional functions
  // have the benefit that they can be used before they are declared. This
  // comes in handy if they reside in the same module that creates the UI.
  //
  // When mixing functional components with custom components
  // (i.e. subclassing), you should use the "asFactory" function
  // so they can be instantiated just like functional components.
  // See https://docs.tabris.com/3.6/declarative-ui.html#asfactory
  //
  // This example creates two minimal components, one via arrow function,
  // the other as a conventional function.

  const ComponentOne = () => TextView({text: 'Declared before UI'});

  examples.append(
    Example({
      title: 'Minimal',
      children: [
        ComponentOne(),
        ComponentTwo()
      ]
    })
  );

  function ComponentTwo() {
    return TextView({text: 'Declared after UI'});
  }

})();

/////////////
// Styling //
/////////////

(() => {

  // The most frequent use of functional components is to pre-configure a
  // widgets visual attributes such as colors, fonts, padding, elevation
  // or corner radius. These components are highly reusable, and allows you
  // have a central place to style your applications look and feel. (Assuming
  // you put them all in one module.) Your main UI code will also become
  // shorter and more expressive this way.
  //
  // This kind of component should usually support the same attributes as the
  // widget that it returns. To achieve this the function must have a single
  // object parameter, here called "attr". Then use the spread operator ("...")
  // to mix it with the other attributes when creating the new widget.
  // YOU MUST NOT USE THE "new" KEYWORD WHEN DOING SO! (Otherwise some
  // attributes will not be respected).
  //
  // You can use JsDoc as seen below to enable auto-completion
  // in the IDE. (Don't forget the "tabris." prefixes or it won't work!).

  /** @param {tabris.Attributes<tabris.TextView>} attr */
  const Warning = attr =>
    TextView({font: '12px serif', textColor: 'red', ...attr});

  examples.append(
    Example({
      title: 'Styled',
      children: [
        TextView({text: 'Normal TextView'}),
        Warning({text: 'A warning'})
      ]
    })
  );

})();

//////////////////////
// Selector support //
//////////////////////

(() => {

  // A functional component can be used as a selector, but this needs to be
  // explicitly enabled for each component. To do so, pass the component
  // function itself as a second parameter when creating the returned widget.
  // Again, you must not use the "new" keyword for this to work.

  /** @param {tabris.Attributes<tabris.TextView>} attr */
  const Warning = attr =>
    TextView({font: '12px serif', textColor: 'red', ...attr}, Warning);

  examples.append(
    Example({
      title: 'Selector Support',
      children: [
        TextView({text: 'not selected'}),
        Warning({text: 'not selected'})
      ]
    })
  );

  $(Warning).set({text: 'selected'});

})();

///////////////////////
// Custom Attributes //
///////////////////////

(() => {

  // You can add your own attributes to your functional component. However,
  // you must not pass it on to the wrapped widget. Instead, extract it via
  // the rest operator ("...") and use it however you want. In this example
  // we use the optional "primary" flag to switch between two stylings.
  // Note that any additional *attributes* do not become *properties* of the
  // widget created by the component either, so they can not be set/changed
  // afterwards.

  /** @param {tabris.Attributes<tabris.Button> & {primary?: boolean}} attr */
  const CustomButton = ({primary, ...attr}) =>
    Button({
      font: primary ? '18px' : '12px',
      style: primary ? 'elevate' : 'outline',
      ...attr,
    });

  examples.append(
    Example({
      title: 'Custom Attributes',
      children: [
        CustomButton({primary: true, text: 'BUY NOW'}),
        CustomButton({text: 'Buy later'})
      ]
    })
  );

})();

/////////////////
// Inheritance //
/////////////////

(() => {

  // You can base your functional component on another functional component.
  // Sometimes this can eliminate even more repetitive code.
  //
  // In this example we have a more extensive UI as you would typically find
  // in a standard custom component, e.g. a page or tab. By extracting the and
  // bottom bars ("Header" and "Footer") - including their own children - the
  // top-level UI code becomes much clearer. Such UI fragments are usually
  // used only once and reside in the same module or class that uses them.
  //
  // The Header and Footer themselves have quite a few attributes in common,
  // so it pays off to base them on a shared base component. In this case
  // it is called "Toolbar" and pre-configures the layout and background.
  // This also demonstrates that functional components can contain children
  // external children if they wrap a Composite. (Or in this case a Row,
  // which inherits from Composite.) Since there is no need for Toolbar to
  // accept other attributes no rest operator is needed.

  examples.append(
    Example({
      title: 'Inheritance',
      padding: 0,
      children: [
        Header(),
        CollectionView({
          stretch: true, cellHeight: 48, itemCount: 40,
          createCell: () => TextView({padding: 12, font: '18px'}),
          updateCell:
            /** @param {tabris.TextView} cell */
            (cell, i) => cell.text = '-' + ((i + 1) * 10) + ' EUR',
        }),
        Footer()
      ]
    })
  );


  function Header() {
    // eslint-disable-next-line max-len
    const image = 'https://github.com/eclipsesource/tabris-js/raw/master/snippets/resources/card%402x.png';
    return Toolbar({
      children: [
        ImageView({image}),
        TextView({text: 'Your Credit Card', font: '24px'})
      ]
    });
  }

  function Footer() {
    return Toolbar({
      children: [
        Button({text: 'Pay all'}),
        Button({text: 'Maybe later...'}),
      ]
    });
  }

  /** @param {{children: tabris.Widget[]}} attr */
  function Toolbar({children}) {
    return Row({
      stretchX: true, alignment: 'centerY', padding: 8, spacing: 8, height: 64,
      background: '#ccc', children
    });
  }

})();

///////////////////
// Interactivity //
///////////////////

(() => {

  // Here we use functional components to extract larger views (tabs) with
  // their own internal children and logic. Usually each of them would be
  // defined in its own separate module. Just imagine this to be the case here.
  //
  // Note that usually any given component should only contain logic directly
  // related to UI interactions, e.g. animations. Otherwise you risk violating
  // the "separation of concerns" principle. In that case consider using a full
  // custom component with a separate presenter, view-model, or redux store.
  //
  // All three of the following examples implement the same demo UI/logic
  // (check boxes interacting with each other) in different ways, though
  // all inherit from "TabStack" for brevity. Read the individual comments
  // on each component for detailed explanations.

  examples.append(
    Example({
      title: 'Interactivity',
      children: [TabFolder({
        stretch: true,
        children: [
          SettingsTabOne(),
          SettingsTabTwo(),
          SettingsTabThree()
        ]
      })]
    })
  );


  /** @param {tabris.Attributes<tabris.Tab>} attr */
  function TabStack(attr) {
    return Tab({layout: new StackLayout(), padding: 12, ...attr});
  }

  // This variant adds listeners directly to each of the two check boxes.
  // To interact with the other check box they traverse the UI
  // hierarchy via the "siblings" method.
  //
  // This is a very simple and concise approach, but also fairly inflexible
  // and fragile. It's simple to make a mistake while traversing the UI:
  // What if there are even more siblings? What if the hierarchy is more
  // deeply nested? Also, you can't change the code easily without
  // breaking it! Overall, this is a valid strategy, but rarely the best.

  function SettingsTabOne() {
    return TabStack({title: 'Settings One', children: [
      CheckBox({
        text: 'Enable convenient feature',
        onSelect: ev => {
          if (ev.checked) {
            ev.target.siblings().last(CheckBox).checked = true;
          }
        }
      }),
      CheckBox({
        text: 'Enable annoying feature',
        onSelect: ev => {
          if (!ev.checked) {
            ev.target.siblings().first(CheckBox).checked = false;
          }
        }
      })
    ]});
  }

  // Here we separate the UI from the logic and use ids to access internal
  // children via the component's root. Since we want to keep the UI part
  // at the top we extract an "init" function below that the finished
  // composition is passed through. Technically that function could be put
  // outside the component function, but this is more neatly scoped.
  //
  // Now that when we assign ids to "internal" children it is recommended to
  // protect them from external access. We do so by overriding the "children()"
  // function so it never returns the actual children. Keep in mind this
  // must happen after any other initialization code.

  function SettingsTabTwo() {

    return init(
      TabStack({title: 'Settings Two', children: [
        CheckBox({id: 'convenient', text: 'Enable convenient feature'}),
        CheckBox({id: 'annoying', text: 'Enable annoying feature'})
      ]})
    );

    /** @param {tabris.Tab} tab */
    function init(tab) {
      const convenient = tab.find(CheckBox).only('#convenient');
      const annoying = tab.find(CheckBox).only('#annoying');
      convenient.onSelect(ev => {
        if (ev.checked) annoying.checked = true;
      });
      annoying.onSelect(ev => {
        if (!ev.checked) convenient.checked = false;
      });
      tab.children = () => new WidgetCollection();
      return tab;
    }

  }

  // This is an evolution of the approach above, splitting the
  // initialization code between multiple functions in the components
  // own inner scope. If you are not familiar with closures in JS, now
  // would be a good time to catch up on that.
  //
  // I would recommend this for components with a lot of internal logic. The
  // code is a good bit more complex, but can be structured similar
  // to a class - just with less code.

  function SettingsTabThree() {

    let convenient  = /** @type {tabris.CheckBox} */(null);
    let annoying = /** @type {tabris.CheckBox} */(null);

    return init(
      TabStack({title: 'Settings Three', children: [
        CheckBox({
          id: 'convenient', onSelect: handleSelect,
          text: 'Enable convenient feature'
        }),
        CheckBox({
          id: 'annoying', onSelect: handleSelect,
          text: 'Enable annoying feature'
        })
      ]})
    );

    /** @param {tabris.Tab} tab */
    function init(tab) {
      convenient = tab.find(CheckBox).only('#convenient');
      annoying = tab.find(CheckBox).only('#annoying');
      tab.children = () => new WidgetCollection();
      return tab;
    }

    /** @param {tabris.CheckBoxSelectEvent} ev */
    function handleSelect(ev) {
      if (ev.target === convenient && ev.checked) {
        annoying.checked = true;
      } else if (ev.target === annoying && !ev.checked) {
        convenient.checked = false;
      }
    }

  }

})();

///////////////////////////////
// Presenting immutable data //
///////////////////////////////

// First we define some data to present...

class Person {
  /**
   * @param {string} lastName
   * @param {string} firstName
   * @param {number} age
   */
  constructor(lastName, firstName, age) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.age = age;
    Object.freeze(this);
  }

}

const joe = new Person('Harris', 'Joe', 45);
const sam = new Person('Shapiro', 'Sam', 51);
const ben = new Person('Rogan', 'Ben', 37);
const people = [joe, sam, ben];

(() => {

  // This covers the simple use case of presenting some static data to the
  // user without any interaction. It's only suitable when the data does
  // not have to be updated during the lifecycle of the component.

  examples.append(
    Example({
      title: 'Static Data',
      children: people.map(person => Card({person}))
    })
  );

  /** @param {tabris.Attributes<tabris.Widget> & {person: Person}} param */
  function Card({person, ...attr}) {
    return Composite({
      padding: 8, background: '#0888', cornerRadius: 8, ...attr,
      children: [
        TextView({markupEnabled: true, text: '&#128512;', font: '48px'}),
        TextView({
          markupEnabled: true, left: 'prev() 12', top: 8, font: '18px',
          text: `<b>${person.firstName} ${person.lastName}</b>`
                 + `<br/><i>Age: ${person.age}</i>`
        })
      ]
    });
  }

})();

///////////////////////////
// CollectionView Cells  //
///////////////////////////

(() => {

  // A functional component can not have any custom properties - only
  // custom attributes. The important distinction between them is that
  // an attribute is a creation parameter only, while a property can be
  // set on the instance. However, all widgets have a "data" property that
  // can be freely used by the application. Via change events the component
  // can react to new values.
  //
  // In this example we use the "data" property to store an instance of
  // person. Internally the "apply" method is used to update the component
  // whenever the value of "data" changes. The resulting component is suitable
  // for use as a CollectionView cell. Again, override the children method
  // at the very end of the initialization code.

  const items = new Array(100).fill(null, 0, 100).map((_, i) => people[i % 3]);

  examples.append(
    Example({
      title: 'CollectionView',
      children: [
        CollectionView({
          stretch: true,
          cellHeight: 80,
          itemCount: items.length,
          createCell: Card,
          updateCell: (cell, i) => cell.data = items[i],
        })
      ]
    })
  );

  function Card() {

    return init(
      Composite({
        padding: 8,
        children: [
          TextView({markupEnabled: true, text: '&#128512;', font: '48px'}),
          TextView({
            id: 'person',
            markupEnabled: true,
            layoutData: {left: 'prev() 12', top: 8},
            font: '18px'
          })
        ]
      })
    );

    /** @param {tabris.Composite} card */
    function init(card) {
      card.apply(
        {mode: 'strict', trigger: 'onDataChanged'},
        ({data: person}) => ({
          TextView: {visible: person instanceof Person},
          '#person': {
            text: person instanceof Person
              ? `<b>${person.firstName} ${person.lastName}</b>`
                + `<br/><i>Age: ${person.age}</i>`
              : ''
          }
        })
      );
      card.children = () => new WidgetCollection();
      return card;
    }

  }

})();


///////////
// Forms //
///////////

(() => {

  // This shows how to add a custom listener (i.e. a callback, in this
  // case a mandatory one) that can be invoked by the internally by the
  // component , e.g. be due user interactions.
  //
  // The listener is attached to the root element via the generic "on"
  // method that allows listening to any arbitrary event type.
  // Later we can call "trigger" with some event data, which will invoke
  // the listener with a EventObject instance carrying the data. The listener
  // could also be invoked directly, but this way it gets a properly
  // initialized EventObject instance.
  //
  // In this specific scenario we create a form that allows editing
  // a "Person" instance. Since it's immutable, a modified copy will be
  // given in the event.

  /**
   *  @typedef {tabris.EventObject<any> & {person: Person}} FormEvent
   *  @typedef {(ev: FormEvent) => any} FormEventListener
   *  @type {FormEventListener}
   */
  examples.append(
    Example({
      title: 'Forms',
      children: [
        PersonEditor({
          person: joe,
          onAccept: ev => AlertDialog.open(
            `New person is ${ev.person.firstName} ${ev.person.lastName}`
          )
        })
      ]
    })
  );


  /** @param {{person: Person, onAccept: FormEventListener}} attributes */
  function PersonEditor({person, onAccept}) {

    return init(
      Composite({
        layout: new StackLayout({spacing: 8, alignment: 'stretchX'}),
        padding: 12,
        children: [
          TextInput({
            id: 'firstName',
            message: 'First Name',
            text: person.firstName
          }),
          TextInput({
            id: 'lastName',
            message: 'Last Name',
            text: person.lastName
          }),
          Button({id: 'save', text: 'Save'})
        ]
      })
    );

    /** @param {tabris.Composite} editor */
    function init(editor) {
      const firstName = editor.find('#firstName').only(TextInput);
      const lastName = editor.find('#lastName').only(TextInput);
      editor.on('accept', onAccept);
      editor.find('#save').only(Button).onSelect(() => {
        editor.trigger('accept', {
          person: new Person(firstName.text, lastName.text, person.age)
        });
      });
      editor.children = () => new WidgetCollection();
      return editor;
    }

  }

})();

// That's all Folks!

//////////////////////
// Setup, Resources //
//////////////////////

(() => {
  const INDEX = 'exampleIndex';
  const allExamples = examples.children();
  allExamples.detach();
  examples.append(allExamples[0]);
  if (localStorage.getItem(INDEX)) {
    const example = allExamples[parseInt(localStorage.getItem(INDEX))];
    examples.children().first().detach();
    examples.append(example);
  }
  examples.visible = true;

  drawer.set({enabled: true}).append(
    Stack({
      stretch: true,
      padding: 8,
      spacing: 4,
      alignment: 'stretchX',
      children: allExamples.map(example => Button({
        text: example.title,
        autoCapitalize: 'none',
        onSelect: () => {
          examples.children().first().detach();
          examples.append(example);
          localStorage.setItem(INDEX, String(allExamples.indexOf(example)));
          drawer.close();
        }
      }))
    })
  );

})();

function MainView() {
  return NavigationView({
    stretch: true,
    pageAnimation: 'none',
    drawerActionVisible: true,
    visible: false
  });
}

/** @param {tabris.Attributes<tabris.Page>} attr */
function Example(attr) {
  return Page({
    layout: new StackLayout({spacing: 4, alignment: 'stretchX'}),
    padding: 8,
    ...attr
  });
}
