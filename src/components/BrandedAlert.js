import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';

const BrandedAlert = ({ visible, title, message, onConfirm, type = 'success' }) => {
  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onConfirm}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.header, type === 'error' ? styles.headerError : styles.headerSuccess]}>
             <Text style={styles.modalTitle}>
                {title || (type === 'success' ? 'Success' : 'Error')}
              </Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.modalText}>{message}</Text>
            <Pressable
                style={styles.button}
                onPress={onConfirm}
            >
                <Text style={styles.buttonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalView: {
    width: '85%',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
    elevation: 10,
  },
  header: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSuccess: {
    backgroundColor: '#1B3022', // Darker green for theme
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  headerError: {
    backgroundColor: '#301B1B', // Darker red for theme
    borderBottomWidth: 2,
    borderBottomColor: '#F44336',
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  body: {
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    color: '#E0E0E0',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#541011', // BRAND COLOR
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 6,
    minWidth: 120,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default BrandedAlert;
