import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Production } from '../../types';
import { dateUtils } from '../../../../NBCBookingApp/utils';

interface CalendarViewProps {
  productions: Production[];
  onDateSelect: (date: Date) => void;
  onProductionPress: (production: Production) => void;
  selectedDate: Date;
  view?: 'week' | 'month';
}

const { width } = Dimensions.get('window');
const DAY_WIDTH = width / 7;

const CalendarView: React.FC<CalendarViewProps> = ({
  productions,
  onDateSelect,
  onProductionPress,
  selectedDate,
  view = 'week'
}) => {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(selectedDate));
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  
  useEffect(() => {
    const start = startOfWeek(currentWeekStart);
    const end = endOfWeek(start);
    const days = eachDayOfInterval({ start, end });
    setWeekDays(days);
  }, [currentWeekStart]);
  
  const changeWeek = (direction: 'prev' | 'next') => {
    const days = direction === 'next' ? 7 : -7;
    setCurrentWeekStart(addDays(currentWeekStart, days));
  };
  
  const getProductionsForDate = (date: Date): Production[] => {
    return productions.filter(prod => isSameDay(prod.date, date));
  };
  
  const renderWeekView = () => {
    return (
      <View style={styles.weekView}>
        <View style={styles.weekHeader}>
          <TouchableOpacity
            style={styles.weekNavigationButton}
            onPress={() => changeWeek('prev')}
          >
            <Icon name="chevron-left" size={24} color="#333" />
          </TouchableOpacity>
          
          <Text style={styles.weekTitle}>
            {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
          </Text>
          
          <TouchableOpacity
            style={styles.weekNavigationButton}
            onPress={() => changeWeek('next')}
          >
            <Icon name="chevron-right" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.daysContainer}>
          {weekDays.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const dayProductions = getProductionsForDate(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <TouchableOpacity
                key={day.toISOString()}
                style={[
                  styles.dayItem,
                  isSelected && styles.selectedDay,
                  isToday && styles.todayDay
                ]}
                onPress={() => onDateSelect(day)}
              >
                <Text style={styles.dayName}>{format(day, 'EEE')}</Text>
                <Text style={[
                  styles.dayNumber,
                  isSelected && styles.selectedDayText,
                  isToday && styles.todayDayText
                ]}>
                  {format(day, 'd')}
                </Text>
                
                {dayProductions.length > 0 && (
                  <View style={styles.productionIndicatorContainer}>
                    {dayProductions.slice(0, 3).map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.productionIndicator,
                          index === 0 && { backgroundColor: '#007bff' },
                          index === 1 && { backgroundColor: '#28a745' },
                          index === 2 && { backgroundColor: '#ffc107' }
                        ]}
                      />
                    ))}
                    {dayProductions.length > 3 && (
                      <Text style={styles.moreIndicator}>+{dayProductions.length - 3}</Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };
  
  const renderDaySchedule = () => {
    const dayProductions = getProductionsForDate(selectedDate);
    
    return (
      <View style={styles.daySchedule}>
        <Text style={styles.dayScheduleTitle}>
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </Text>
        
        {dayProductions.length > 0 ? (
          <ScrollView contentContainerStyle={styles.scheduledProductionsContainer}>
            {dayProductions.map((production) => (
              <TouchableOpacity
                key={production.id}
                style={styles.scheduledProduction}
                onPress={() => onProductionPress(production)}
              >
                <View style={[
                  styles.productionStatusIndicator,
                  production.status === 'confirmed' && styles.confirmedStatus,
                  production.status === 'completed' && styles.completedStatus,
                  production.status === 'cancelled' && styles.cancelledStatus,
                  production.status === 'overtime' && styles.overtimeStatus
                ]} />
                
                <View style={styles.productionDetails}>
                  <Text style={styles.productionName}>{production.name}</Text>
                  <Text style={styles.productionTime}>
                    {format(production.startTime, 'h:mm a')} - {format(production.endTime, 'h:mm a')}
                  </Text>
                  <Text style={styles.productionVenue}>{production.venue}</Text>
                </View>
                
                <Icon name="chevron-right" size={24} color="#ccc" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.noProductionsContainer}>
            <Icon name="event-busy" size={48} color="#ddd" />
            <Text style={styles.noProductionsText}>No productions scheduled</Text>
          </View>
        )}
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      {renderWeekView()}
      {renderDaySchedule()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  weekView: {
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  weekNavigationButton: {
    padding: 8,
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 12,
  },
  dayItem: {
    width: DAY_WIDTH,
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  selectedDay: {
    backgroundColor: '#e6f7ff',
    borderWidth: 1,
    borderColor: '#91d5ff',
  },
  todayDay: {
    borderWidth: 1,
    borderColor: '#007bff',
  },
  dayName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  selectedDayText: {
    color: '#007bff',
  },
  todayDayText: {
    color: '#007bff',
  },
  productionIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  productionIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007bff',
    marginHorizontal: 1,
  },
  moreIndicator: {
    fontSize: 10,
    color: '#666',
    marginLeft: 2,
  },
  daySchedule: {
    flex: 1,
    padding: 16,
  },
  dayScheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  scheduledProductionsContainer: {
    paddingBottom: 20,
  },
  scheduledProduction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  productionStatusIndicator: {
    width: 4,
    height: '70%',
    borderRadius: 2,
    backgroundColor: '#999',
    marginRight: 12,
  },
  confirmedStatus: {
    backgroundColor: '#2196F3',
  },
  completedStatus: {
    backgroundColor: '#4CAF50',
  },
  cancelledStatus: {
    backgroundColor: '#F44336',
  },
  overtimeStatus: {
    backgroundColor: '#FF9800',
  },
  productionDetails: {
    flex: 1,
  },
  productionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productionTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  productionVenue: {
    fontSize: 14,
    color: '#666',
  },
  noProductionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noProductionsText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  }
});

export default CalendarView;