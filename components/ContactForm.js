import React, {useEffect, useState} from 'react';
import {View, TextInput, Pressable, Text, StyleSheet} from 'react-native';

const defaultValues = {
  name: '',
  phone: '',
  email: '',
  company: '',
};

export default function ContactForm({
  mode = 'create',
  initialValues = defaultValues,
  submitLabel = 'Save contact',
  onSubmit,
  onCancel,
}) {
  const [formValues, setFormValues] = useState(initialValues);

  useEffect(() => {
    setFormValues(initialValues);
  }, [initialValues]);

  const handleChange = (key, value) => {
    setFormValues((prev) => ({...prev, [key]: value}));
  };

  const disabled =
    !formValues.name.trim() || !formValues.phone.trim() || !onSubmit;

  const handleSubmit = () => {
    if (disabled) {
      return;
    }
    onSubmit({
      name: formValues.name.trim(),
      phone: formValues.phone.trim(),
      email: formValues.email.trim(),
      company: formValues.company.trim(),
    });
  };

  return (
    <View style={styles.card}>
      <TextInput
        placeholder="Full name"
        placeholderTextColor="#7e8ba3"
        value={formValues.name}
        onChangeText={(value) => handleChange('name', value)}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone number"
        keyboardType="phone-pad"
        placeholderTextColor="#7e8ba3"
        value={formValues.phone}
        onChangeText={(value) => handleChange('phone', value)}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#7e8ba3"
        value={formValues.email}
        onChangeText={(value) => handleChange('email', value)}
        style={styles.input}
      />
      <TextInput
        placeholder="Company"
        placeholderTextColor="#7e8ba3"
        value={formValues.company}
        onChangeText={(value) => handleChange('company', value)}
        style={styles.input}
      />

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={handleSubmit}
          style={({pressed}) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
            disabled && styles.buttonDisabled,
          ]}
          disabled={disabled}>
          <Text style={styles.primaryLabel}>{submitLabel}</Text>
        </Pressable>
        {mode === 'edit' && onCancel ? (
          <Pressable
            accessibilityRole="button"
            onPress={onCancel}
            style={({pressed}) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}>
            <Text style={styles.secondaryLabel}>Cancel</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1c2a3e',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#142033',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f4f6fb',
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#4a9fff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButton: {
    flexBasis: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4a9fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryLabel: {
    color: '#0b1220',
    fontWeight: '700',
  },
  secondaryLabel: {
    color: '#4a9fff',
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
