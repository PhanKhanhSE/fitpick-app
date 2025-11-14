import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../utils/theme';
import { useProUser } from '../../hooks/useProUser';
import { testProUserFeatures } from '../../utils/proUserTest';

interface ProUserDebugInfoProps {
  visible?: boolean;
}

const ProUserDebugInfo: React.FC<ProUserDebugInfoProps> = ({ visible = false }) => {
  const { permissions, loading, error } = useProUser();
  const [testResults, setTestResults] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const runTests = async () => {
    const results = await testProUserFeatures();
    setTestResults(results);
  };

  useEffect(() => {
    if (visible) {
      runTests();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setShowDetails(!showDetails)}
      >
        <Text style={styles.title}>🔍 Pro User Debug Info</Text>
        <Text style={styles.toggle}>{showDetails ? '▼' : '▶'}</Text>
      </TouchableOpacity>
      
      {showDetails && (
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Permissions:</Text>
            {loading ? (
              <Text style={styles.text}>Loading...</Text>
            ) : error ? (
              <Text style={styles.errorText}>Error: {error}</Text>
            ) : permissions ? (
              <View>
                <Text style={styles.text}>• Is Pro User: {permissions.isProUser ? '✅' : '❌'}</Text>
                <Text style={styles.text}>• Can View Future Dates: {permissions.canViewFutureDates ? '✅' : '❌'}</Text>
                <Text style={styles.text}>• Can Plan Future Meals: {permissions.canPlanFutureMeals ? '✅' : '❌'}</Text>
                <Text style={styles.text}>• Can View Past Dates: {permissions.canViewPastDates ? '✅' : '❌'}</Text>
                <Text style={styles.text}>• Can Use Premium Features: {permissions.canUsePremiumFeatures ? '✅' : '❌'}</Text>
                <Text style={styles.text}>• Can Create Weekly Meal Plan: {permissions.canCreateWeeklyMealPlan ? '✅' : '❌'}</Text>
                <Text style={styles.text}>• Can View Detailed Reports: {permissions.canViewDetailedReports ? '✅' : '❌'}</Text>
              </View>
            ) : (
              <Text style={styles.text}>No permissions data</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>API Test Results:</Text>
            {testResults ? (
              <View>
                <Text style={styles.text}>• API Test Success: {testResults.isPro ? '✅' : '❌'}</Text>
                <Text style={styles.text}>• Permissions Available: {testResults.permissions ? '✅' : '❌'}</Text>
                <Text style={styles.text}>• Profile Available: {testResults.profile ? '✅' : '❌'}</Text>
              </View>
            ) : (
              <Text style={styles.text}>No test results</Text>
            )}
          </View>

          <TouchableOpacity style={styles.button} onPress={runTests}>
            <Text style={styles.buttonText}>🔄 Run Tests Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    margin: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  title: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  toggle: {
    fontSize: 12,
    color: COLORS.text,
  },
  content: {
    padding: 10,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 5,
  },
  text: {
    fontSize: 10,
    color: COLORS.text,
    marginLeft: 10,
  },
  errorText: {
    fontSize: 10,
    color: 'red',
    marginLeft: 10,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
});

export default ProUserDebugInfo;
