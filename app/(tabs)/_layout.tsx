import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../../constants/theme';
import { HomeIcon, ReviewIcon, CalendarIcon, SettingsIcon } from '../../components/Icons';
import type { IconProps } from '../../components/Icons';

function TabIcon({ Icon, focused, color }: { Icon: React.FC<IconProps>; focused: boolean; color: string }) {
  return <Icon size={28} color={color} strokeWidth={focused ? 2.5 : 2} />;
}

export default function TabLayout() {
  const Colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopWidth: 2,
          borderTopColor: Colors.borderLight,
          height: 64 + (Platform.OS === 'android' ? Math.max(insets.bottom, 0) : 0),
          paddingBottom: Platform.OS === 'android' ? Math.max(insets.bottom, 0) : 8,
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