import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Button,
  FlatList,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const ReminderSettingsScreen = () => {
  const [mealReminder, setMealReminder] = useState(true);
  const [loggingReminder, setLoggingReminder] = useState(true);
  const [healthCheckReminder, setHealthCheckReminder] = useState(false);

  const handleSave = () => {
    // Implement save logic here
    alert('Reminder settings saved!');
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Reminder Settings</Text>
      {/* Reminder Toggle Switches */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Meal Plan Reminders</Text>
        <Switch
          value={mealReminder}
          onValueChange={() => setMealReminder((prev) => !prev)}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Food Logging Reminders</Text>
        <Switch
          value={loggingReminder}
          onValueChange={() => setLoggingReminder((prev) => !prev)}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Health Check-in Reminders</Text>
        <Switch
          value={healthCheckReminder}
          onValueChange={() => setHealthCheckReminder((prev) => !prev)}
        />
      </View>

      <Button title="Save Settings" onPress={handleSave} />
    </View>
  );
};

const NotificationScreen = () => {
  const notificationsData = [
    { id: '1', message: 'You have a meal planned for today at 12:00 PM.', time: '10:00 AM' },
    { id: '2', message: 'Don’t forget to log your breakfast!', time: '9:00 AM' },
    { id: '3', message: 'Health check-in due tomorrow.', time: 'Yesterday' },
  ];

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notificationsData}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            <Text style={styles.notificationMessage}>{item.message}</Text>
            <Text style={styles.notificationTime}>{item.time}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const renderScene = SceneMap({
  reminders: ReminderSettingsScreen,
  notifications: NotificationScreen,
});

const ReminderNotificationScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'reminders', title: 'Reminders' },
    { key: 'notifications', title: 'Notifications' },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: 400 }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          style={styles.tabBar}
          labelStyle={styles.tabLabel}
          indicatorStyle={styles.tabIndicator}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 10,
  },
  settingText: {
    fontSize: 18,
  },
  notificationCard: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 10,
  },
  notificationMessage: {
    fontSize: 16,
  },
  notificationTime: {
    fontSize: 12,
    color: '#555',
    marginTop: 5,
  },
  tabBar: {
    backgroundColor: '#6200EE',
  },
  tabLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabIndicator: {
    backgroundColor: '#fff',
  },
});

export default ReminderNotificationScreen;
