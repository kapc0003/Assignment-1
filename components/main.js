//Page Header - includes: a title ('h1') and an image
let pageHeader = React.createClass({
    propTypes: {
    },
    render: function() {
        return(
            React.createElement('div', {className: 'page-header'},
                React.createElement('h1', {}, 'Contact List'),
                React.createElement('p', {},
                    React.createElement('img', {src: './img/address-book.png', width: '130px'})
                )
            )
        );
    }
});

//Navigation Menu - includes: Contact List (default view) and Add New Contact
let navMenu = React.createClass({
    render: function() {
        return (
            React.createElement('ul', {className: 'nav-menu'},
                React.createElement('li', {},
                    React.createElement('a', {href: '#'}, 'Contact List')
                ),

                React.createElement('li', {},
                    React.createElement('a', {href: '#newItem'}, 'Add New Contact')
                )
            )
        );
    }
});

//Creating a list of items to display on the itemPage
let listItem = React.createClass({
    propTypes: {
        'id': React.PropTypes.number,
        'name': React.PropTypes.string.isRequired,
        'birthday': React.PropTypes.string.isRequired,
        'email': React.PropTypes.string.isRequired
    },

    render: function() {
        return (
            React.createElement('li', {},
                React.createElement('a', {className: 'nav-item-link', href: '#/item/' + this.props.id},
                    React.createElement('h2', {className: 'list-item-name'}, this.props.name),
                    React.createElement('div', {className: 'list-item-date-of-birth'}, this.props.birthday))
            )
        );
    }
});

let listItems = React.createClass({
    propTypes: {
        'items': React.PropTypes.array.isRequired
    },

    render: function() {
        return (
            React.createElement('ul', {className: 'list-item-menu'}, this.props.items.map(i => React.createElement(listItem, i)))
        );
    }
});

//Main Page (default view) - Contact List
let itemPage = React.createClass({
    propTypes: {
        'items': React.PropTypes.array.isRequired
    },

    render: function() {
        return (
            React.createElement(listItems, {items: this.props.items})
        );
    }
});

//Clicking on an element - page displays the details of the contact
let itemDetails = React.createClass({
    propTypes: {
        'name': React.PropTypes.string.isRequired,
        'birthday': React.PropTypes.string.isRequired,
        'email': React.PropTypes.string.isRequired
    },

    render: function() {
        return (
            React.createElement('div', {className: 'list-item-menu-details'},
                React.createElement('p', {className: 'list-name-details'},this.props.name),
                React.createElement('p', {}, 'Birthday: ' + this.props.birthday),
                React.createElement('a', {href: 'mailto:' + this.props.email}, 'Email: ' + this.props.email)

            )
        );
    }
});

//Form - allows users to add a contact
let addItemForm = React.createClass({
    propTypes: {
        'listItem': React.PropTypes.object.isRequired,
        'onChange': React.PropTypes.func.isRequired,
        'onAdd': React.PropTypes.func.isRequired
    },
    onNameChange: function(e) {
        this.props.onChange(Object.assign({}, this.props.listItem, {name: e.target.value}));
    },
    onBirthdayChange: function(e) {
        this.props.onChange(Object.assign({}, this.props.listItem, {birthday: e.target.value}));
    },
    onEmailChange: function(e) {
        this.props.onChange(Object.assign({}, this.props.listItem, {email: e.target.value}));
    },
    onAdd: function() {
        this.props.onAdd(this.props.listItem);
    },
    render: function() {
        return (
            React.createElement('form', {},
                React.createElement('input', {
                    type: 'text',
                    placeholder: 'Name',
                    value: this.props.listItem.name,
                    onChange: this.onNameChange
                }),
                React.createElement('input', {
                    type: 'text',
                    placeholder: 'Birthday',
                    value: this.props.listItem.birthday,
                    onChange: this.onBirthdayChange
                }),
                React.createElement('input', {
                    placeholder: 'Email Address',
                    value: this.props.listItem.email,
                    onChange: this.onEmailChange
                }),
                React.createElement('button', {type: 'button', onClick: this.onAdd}, 'Add')
            )
        );
    }
});

//addContact Page - includes form
let addContact = React.createClass({
    propTypes: {
        'listItem': React.PropTypes.object.isRequired,
        'onNewItemChange': React.PropTypes.func.isRequired,
        'onAddNewItem': React.PropTypes.func.isRequired
    },

    render: function() {
        return (
            React.createElement('div', {},
                React.createElement(addItemForm, {listItem: this.props.listItem, onChange: this.props.onNewItemChange, onAdd: this.props.onAddNewItem})
            )
        );
    }
});

//Switch Statement - change between Contact List and Add New Contact page
let state = {};
let setState = function(changes) {
    let component;
    let componentProperties = {};

    Object.assign(state, changes);

    let splitUrl = state.location.replace(/^#\/?|\/$/g, '').split('/');

    switch(splitUrl[0]) {
    case 'item': {
        component = itemDetails;
        componentProperties = state.items.find(i => i.key == splitUrl[1]);
        break;
    }

    case 'newItem': {
        component = addContact;
        componentProperties = {
            listItem: state.listItem,
            onNewItemChange: function (item) {
                setState({listItem: item});
            },
            onAddNewItem: function (item) {
                let itemList = state.items;
                const newKey = itemList.length + 1;
                itemList.push(Object.assign({}, {key: newKey, id: newKey}, item));
                setState({items: itemList, listItem: {name: '', email: '', birthday: ''}});
            }
        };
        break;
    }

    default: {
        component = itemPage;
        componentProperties = {items: state.items};
    }
    }

    let rootElement = React.createElement('div', {},
        React.createElement(pageHeader, {}),
        React.createElement(navMenu, {}),
        React.createElement(component, componentProperties)
    );

    ReactDOM.render(rootElement, document.getElementById('react-app'));
};

window.addEventListener('hashchange', ()=>setState({location: location.hash}));

setState({listItem: {name: '', email: '', birthday: ''}, location: location.hash, items: items});