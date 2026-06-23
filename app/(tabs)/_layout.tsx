import { Tabs } from 'expo-router';
import { Colors } from '../../constants/theme';
import { HomeIcon, ReviewIcon, CalendarIcon, SettingsIcon } from '../../components/Icons';
import type { IconProps } from '../../components/Icons';

// Tab icon helper: renders icon with active color when focused
function TabIcon({ Icon, focused, color }: { Icon: React.FC<IconProps>; focused: boolean; color: string }) {
  return <Icon size={28} color={color} strokeWidth={focused ? 2.5 : 2} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 2,
          borderTopColor: Colors.borderLight,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={HomeIcon} focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: 'Review',
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={ReviewIcon} focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={CalendarIcon} focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={SettingsIcon} focused={focused} color={color} />,
        }}
      />
    </Tabs>
  );
}