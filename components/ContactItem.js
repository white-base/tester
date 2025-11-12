import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';

export default function ContactItem({contact, onEdit, onDelete}) {
  return (
    <View style={styles.card}>
      <View style={styles.meta}>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.phone}>{contact.phone}</Text>
        {contact.email ? <Text style={styles.note}>{contact.email}</Text> : null}
        {contact.company ? (
          <Text style={styles.note}>{contact.company}</Text>
        ) : null}
      </View>
      <View style={styles.actions}>
        <Pressable
          accessibilityLabel={`Edit ${contact.name}`}
          onPress={onEdit}
          style={({pressed}) => [
            styles.actionButton,
            styles.editButton,
            pressed && styles.buttonPressed,
          ]}>
          <Text style={styles.editLabel}>Edit</Text>
        </Pressable>
        <Pressable
          accessibilityLabel={`Delete ${contact.name}`}
          onPress={onDelete}
          style={({pressed}) => [
            styles.actionButton,
            styles.deleteButton,
            pressed && styles.buttonPressed,
          ]}>
          <Text style={styles.deleteLabel}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#152033',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  meta: {
    marginBottom: 12,
    gap: 4,
  },
  name: {
    color: '#f4f6fb',
    fontSize: 18,
    fontWeight: '700',
  },
  phone: {
    color: '#9fc1ff',
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    color: '#9aa9c2',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  editButton: {
    borderColor: '#4a9fff',
  },
  deleteButton: {
    borderColor: '#f76b6b',
  },
  editLabel: {
    color: '#4a9fff',
    fontWeight: '600',
  },
  deleteLabel: {
    color: '#f76b6b',
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
