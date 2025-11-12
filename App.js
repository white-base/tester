import React, {useMemo} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StatusBar,
  StyleSheet,
} from 'react-native';
import ContactForm from './components/ContactForm';
import ContactItem from './components/ContactItem';
import {useContacts} from './hooks/useContacts';

const emptyContact = {
  name: '',
  phone: '',
  email: '',
  company: '',
};

export default function App() {
  const {
    contacts,
    selectedId,
    stats,
    selectForEditing,
    clearSelection,
    createContact,
    updateContact,
    deleteContact,
  } = useContacts();

  const selectedContact = useMemo(
    () => contacts.find((contact) => contact.id === selectedId) ?? emptyContact,
    [contacts, selectedId],
  );

  const handleSubmit = (values) => {
    if (selectedId) {
      updateContact(selectedId, values);
    } else {
      createContact(values);
    }
    clearSelection();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.heading}>React Native Contacts CRUD</Text>
        <Text style={styles.subheading}>
          {stats.total} contacts · {stats.companies} companies
        </Text>

        <ContactForm
          mode={selectedId ? 'edit' : 'create'}
          initialValues={selectedContact}
          submitLabel={selectedId ? 'Update contact' : 'Add contact'}
          onSubmit={handleSubmit}
          onCancel={selectedId ? clearSelection : undefined}
        />

        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.empty}>Start by adding your first contact.</Text>
          }
          renderItem={({item}) => (
            <ContactItem
              contact={item}
              onEdit={() => selectForEditing(item.id)}
              onDelete={() => deleteContact(item.id)}
            />
          )}
          contentContainerStyle={
            contacts.length === 0 ? styles.emptyContainer : undefined
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#101b29',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginVertical: 12,
  },
  subheading: {
    color: '#8ea4c8',
    marginBottom: 16,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    color: '#8ea4c8',
    fontSize: 16,
  },
});
