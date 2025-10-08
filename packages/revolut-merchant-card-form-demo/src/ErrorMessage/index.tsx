import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ErrorMessageProps {
  title: string;
  message: string;
}

export const ErrorMessage = ({ title, message }: ErrorMessageProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF3F3',
    borderColor: '#FFB8B8',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    width: '85%',
    alignItems: 'center',
    flexDirection: 'column',
  },
  icon: {
    fontSize: 24,
    marginBottom: 8,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#D8000C',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#D8000C',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 12,
    width: '50%',
  },
});
