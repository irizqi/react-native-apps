import Dashboard from "@/components/dashboard";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  return <SafeAreaView style={{ flex: 1 }}>
    <Dashboard />
  </SafeAreaView>;
}
