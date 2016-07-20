/* ********************************************************

Contacts

**********************************************************/

function getContacts(filter) {
    var results = document.getElementById('contact_results');
    var obj = new ContactFindOptions();
    if (filter) {
        obj.filter = filter;
    }
    obj.multiple = true;
    navigator.contacts.find(["displayName", "name", "phoneNumbers",
        "emails", "urls", "note"
    ], function(contacts) {
        var s = "";
        if (contacts.length === 0) {
            s = "No contacts found";
        } else {
            s = "Number of contacts: " + contacts.length +
                "<br><table width='100%'><tr><th>Name</th><td>Phone</td><td>Email</td></tr>";
            for (var i = 0; i < contacts.length; i++) {
                var contact = contacts[i];
                var contactNameTag = contact.name ? "<tr><td>" +
                    contact.name.formatted + "</td><td>" :
                    "<tr><td>(No Name)</td><td>";
                s = s + contactNameTag;
                if (contact.phoneNumbers && contact.phoneNumbers.length >
                    0) {
                    s = s + contact.phoneNumbers[0].value;
                }
                s = s + "</td><td>";
                if (contact.emails && contact.emails.length > 0) {
                    s = s + contact.emails[0].value;
                }
                s = s + "</td></tr>";
            }
            s = s + "</table>";
        }
        results.innerHTML = s;
    }, function(e) {
        if (e.code === ContactError.NOT_SUPPORTED_ERROR) {
            results.innerHTML =
                "Searching for contacts is not supported.";
        } else {
            results.innerHTML = "Search failed: error " + e.code;
        }
    }, obj);
}

function filterContacts() {
    var filter = document.getElementById('searchstring');
    getContacts(filter.value);
}

function pickContact() {
    var results = document.getElementById('contact_results');
    navigator.contacts.pickContact(function(contact) {
        results.innerHTML = contact ? "Picked contact: <pre>" +
            JSON.stringify(contact, null, 4) + "</pre>" :
            "No contacts found";
    }, function(e) {
        results.innerHTML = (e && e.code === ContactError.NOT_SUPPORTED_ERROR) ?
            "Searching for contacts is not supported." : (e && e.code ===
                ContactError.OPERATION_CANCELLED_ERROR) ?
            "Pick cancelled" : "Pick failed: error " + (e && e.code);
    });
}

function addContact(displayName, name, phoneNumber, birthday) {
    try {
        var results = document.getElementById('contact_results');
        var contact = navigator.contacts.create({
            "displayName": displayName,
            "name": name,
            "birthday": birthday,
            "note": "DeleteMe"
        });
        var phoneNumbers = [1];
        phoneNumbers[0] = new ContactField('work', phoneNumber, true);
        contact.phoneNumbers = phoneNumbers;
        contact.save(function() {
            results.innerHTML = (displayName || "Nameless contact") +
                " saved.";
        }, function(e) {
            if (e.code === ContactError.NOT_SUPPORTED_ERROR) {
                results.innerHTML =
                    "Saving contacts not supported.";
            } else {
                results.innerHTML = "Contact save failed: error " +
                    e.code;
            }
        });
    } catch (e) {
        console.error(e.message);
    }
}

function addDooneyEvans() {
    var displayName = "Dooney Evans";
    var contactName = {
        formatted: "Dooney Evans",
        familyName: "Evans",
        givenName: "Dooney",
        middleName: ""
    };
    var phoneNumber = '512-555-1234';
    var birthday = new Date(1985, 0, 23);
    addContact(displayName, contactName, phoneNumber, birthday);
}

function addNamelessContact() {
    addContact();
}

function addUnicodeContact() {
    var displayName = "Н€йромонах \nФеофаЊ";
    var contactName = {
        formatted: "Н€йромонах \nФеофаЊ",
        familyName: "\nФеофаЊ",
        givenName: "Н€йромонах",
        middleName: ""
    };
    addContact(displayName, contactName);
}

function renameDooneyEvans() {
    var results = document.getElementById('contact_results');
    var obj = new ContactFindOptions();
    obj.filter = 'Dooney Evans';
    obj.multiple = false;
    navigator.contacts.find(['displayName', 'name'], function(contacts) {
        if (contacts.length === 0) {
            results.innerHTML = 'No contacts to update.';
            return;
        }
        var contact = contacts[0];
        contact.displayName = "Urist McContact";
        var name = new ContactName();
        name.givenName = "Urist";
        name.familyName = "McContact";
        contact.name = name;
        contact.save(function(updated) {
            results.innerHTML = 'Contact updated.';
        }, function(e) {
            results.innerHTML = 'Update failed: error ' + e
                .code;
        });
    }, function(e) {
        if (e.code === ContactError.NOT_SUPPORTED_ERROR) {
            results.innerHTML =
                'Searching for contacts is not supported.';
        } else {
            results.innerHTML = 'Search failed: error ' + e.code;
        }
    }, obj);
}

function removeTestContacts() {
    var results = document.getElementById('contact_results');
    results.innerHTML = "";
    var obj = new ContactFindOptions();
    obj.filter = 'DeleteMe';
    obj.multiple = true;
    navigator.contacts.find(['note'], function(contacts) {
        var removes = [];
        contacts.forEach(function(contact) {
            removes.push(contact);
        });
        if (removes.length === 0) {
            results.innerHTML = "No contacts to remove";
            return;
        }
        var nextToRemove;
        if (removes.length > 0) {
            nextToRemove = removes.shift();
        }

        function removeNext(item) {
            if (typeof item === 'undefined') {
                return;
            }
            if (removes.length > 0) {
                nextToRemove = removes.shift();
            } else {
                nextToRemove = undefined;
            }
            item.remove(function removeSucceeded() {
                results.innerHTML +=
                    "Removed a contact with ID " + item
                    .id + "<br/>";
                removeNext(nextToRemove);
            }, function removeFailed() {
                results.innerHTML +=
                    "Failed to remove a contact with ID " +
                    item.id + "<br/>";
                removeNext(nextToRemove);
            });
        }
        removeNext(nextToRemove);
    }, function(e) {
        if (e.code === ContactError.NOT_SUPPORTED_ERROR) {
            results.innerHTML =
                'Searching for contacts is not supported.';
        } else {
            results.innerHTML = 'Search failed: error ' + e.code;
        }
    }, obj);
}

function nameMatches(contact, contactName) {
        if (contactName === null && (contact.name === null || contact.name.formatted === null)) {
            return true;
        } else if (contact.name && contact.name.formatted && contact.name.formatted
            .indexOf(contactName) > -1) {
            return true;
        }
        return false;
}