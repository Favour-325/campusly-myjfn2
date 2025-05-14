import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Search, Filter, FileText, FileImage, FileSpreadsheet, FileArchive } from 'lucide-react-native';
import colors from '@/constants/colors';
import { studyMaterials } from '@/mocks/study-materials';
import { examResults } from '@/mocks/exam-results';
import ExamResultCard from '@/components/ExamResultCard';

type FilterType = 'all' | 'subject' | 'teacher' | 'level' | 'type';
type ContentType = 'materials' | 'results';

export default function StudyMaterialsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [contentType, setContentType] = useState<ContentType>('materials');

  // Extract unique values for filters
  const subjects = [...new Set(studyMaterials.map(item => item.subject))];
  const teachers = [...new Set(studyMaterials.map(item => item.uploadedBy))];
  const levels = [...new Set(studyMaterials.map(item => item.level))];
  const types = [...new Set(studyMaterials.map(item => item.type))];

  const getFilteredMaterials = () => {
    let filtered = studyMaterials;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filters
    if (selectedSubject) {
      filtered = filtered.filter(item => item.subject === selectedSubject);
    }

    if (selectedTeacher) {
      filtered = filtered.filter(item => item.uploadedBy === selectedTeacher);
    }

    if (selectedLevel) {
      filtered = filtered.filter(item => item.level === selectedLevel);
    }

    if (selectedType) {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    return filtered;
  };

  const getFilteredResults = () => {
    if (!searchQuery) return examResults;

    return examResults.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const resetFilters = () => {
    setSelectedSubject('');
    setSelectedTeacher('');
    setSelectedLevel('');
    setSelectedType('');
    setActiveFilter('all');
    setShowFilterOptions(false);
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText size={24} color={colors.error} />;
      case 'doc':
      case 'docx':
        return <FileText size={24} color="#2B579A" />;
      case 'ppt':
      case 'pptx':
        return <FileText size={24} color="#D24726" />;
      case 'xls':
      case 'xlsx':
        return <FileSpreadsheet size={24} color="#217346" />;
      case 'jpg':
      case 'png':
      case 'gif':
        return <FileImage size={24} color={colors.secondary} />;
      default:
        return <FileArchive size={24} color={colors.textLight} />;
    }
  };

  const renderFilterOptions = () => {
    if (!showFilterOptions) return null;

    let options: string[] = [];
    let currentSelection = '';
    let setSelection: (value: string) => void = () => { };

    switch (activeFilter) {
      case 'subject':
        options = subjects;
        currentSelection = selectedSubject;
        setSelection = setSelectedSubject;
        break;
      case 'teacher':
        options = teachers;
        currentSelection = selectedTeacher;
        setSelection = setSelectedTeacher;
        break;
      case 'level':
        options = levels;
        currentSelection = selectedLevel;
        setSelection = setSelectedLevel;
        break;
      case 'type':
        options = types;
        currentSelection = selectedType;
        setSelection = setSelectedType;
        break;
      default:
        return null;
    }

    return (
      <View style={styles.filterOptionsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.filterOption,
                currentSelection === option && styles.activeFilterOption
              ]}
              onPress={() => {
                setSelection(currentSelection === option ? '' : option);
                setShowFilterOptions(false);
              }}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  currentSelection === option && styles.activeFilterOptionText
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderMaterialItem = ({ item }: { item: typeof studyMaterials[0] }) => (
    <TouchableOpacity style={styles.materialItem}>
      <View style={styles.materialIconContainer}>
        {getFileIcon(item.type)}
      </View>

      <View style={styles.materialContent}>
        <Text style={styles.materialTitle}>{item.title}</Text>

        <View style={styles.materialDetails}>
          <Text style={styles.materialSubject}>{item.subject}</Text>
          <Text style={styles.materialInfo}>
            {item.uploadedBy} • {item.uploadDate}
          </Text>
        </View>

        <View style={styles.materialTags}>
          <View style={styles.materialTag}>
            <Text style={styles.materialTagText}>{item.level}</Text>
          </View>

          <View style={[styles.materialTag, styles.typeTag]}>
            <Text style={styles.materialTagText}>{item.type.toUpperCase()}</Text>
          </View>

          <Text style={styles.materialSize}>{item.size}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleViewResult = (item: typeof examResults[0]) => {
    Alert.alert(
      'View Result',
      `Opening ${item.title} for ${item.course}`,
      [{ text: 'OK' }]
    );
  };

  const handleDownloadResult = (item: typeof examResults[0]) => {
    Alert.alert(
      'Download Result',
      `Downloading ${item.title} (${item.size})`,
      [{ text: 'OK' }]
    );
  };

  const renderResultItem = ({ item }: { item: typeof examResults[0] }) => (
    <ExamResultCard
      title={item.title}
      course={item.course}
      semester={item.semester}
      uploadedBy={item.uploadedBy}
      uploadDate={item.uploadDate}
      size={item.size}
      onView={() => handleViewResult(item)}
      onDownload={() => handleDownloadResult(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder={contentType === 'materials' ? "Search study materials..." : "Search exam results..."}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textLight}
          />
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterOptions(!showFilterOptions)}
        >
          <Filter size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.contentTypeContainer}>
        <TouchableOpacity
          style={[
            styles.contentTypeButton,
            contentType === 'materials' && styles.activeContentTypeButton
          ]}
          onPress={() => setContentType('materials')}
        >
          <Text
            style={[
              styles.contentTypeText,
              contentType === 'materials' && styles.activeContentTypeText
            ]}
          >
            Study Materials
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.contentTypeButton,
            contentType === 'results' && styles.activeContentTypeButton
          ]}
          onPress={() => setContentType('results')}
        >
          <Text
            style={[
              styles.contentTypeText,
              contentType === 'results' && styles.activeContentTypeText
            ]}
          >
            Exam Results
          </Text>
        </TouchableOpacity>
      </View>

      {contentType === 'materials' && (
        <>
          <View style={styles.filterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.filterTab,
                  activeFilter === 'all' && styles.activeFilterTab
                ]}
                onPress={() => {
                  setActiveFilter('all');
                  setShowFilterOptions(false);
                }}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    activeFilter === 'all' && styles.activeFilterTabText
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterTab,
                  activeFilter === 'subject' && styles.activeFilterTab
                ]}
                onPress={() => {
                  setActiveFilter('subject');
                  setShowFilterOptions(true);
                }}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    activeFilter === 'subject' && styles.activeFilterTabText
                  ]}
                >
                  Subject
                  {selectedSubject ? ` (${selectedSubject})` : ''}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterTab,
                  activeFilter === 'teacher' && styles.activeFilterTab
                ]}
                onPress={() => {
                  setActiveFilter('teacher');
                  setShowFilterOptions(true);
                }}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    activeFilter === 'teacher' && styles.activeFilterTabText
                  ]}
                >
                  Teacher
                  {selectedTeacher ? ` (${selectedTeacher})` : ''}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterTab,
                  activeFilter === 'level' && styles.activeFilterTab
                ]}
                onPress={() => {
                  setActiveFilter('level');
                  setShowFilterOptions(true);
                }}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    activeFilter === 'level' && styles.activeFilterTabText
                  ]}
                >
                  Level
                  {selectedLevel ? ` (${selectedLevel})` : ''}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterTab,
                  activeFilter === 'type' && styles.activeFilterTab
                ]}
                onPress={() => {
                  setActiveFilter('type');
                  setShowFilterOptions(true);
                }}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    activeFilter === 'type' && styles.activeFilterTabText
                  ]}
                >
                  File Type
                  {selectedType ? ` (${selectedType})` : ''}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {renderFilterOptions()}

          {(selectedSubject || selectedTeacher || selectedLevel || selectedType) && (
            <View style={styles.activeFiltersContainer}>
              <Text style={styles.activeFiltersText}>Active filters:</Text>
              <TouchableOpacity onPress={resetFilters}>
                <Text style={styles.clearFiltersText}>Clear all</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {contentType === 'materials' ? (
        <FlatList
          data={getFilteredMaterials()}
          renderItem={renderMaterialItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.materialsList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No study materials found</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={getFilteredResults()}
          renderItem={renderResultItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.materialsList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No exam results found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

import { ScrollView } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  contentTypeContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 4,
  },
  contentTypeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeContentTypeButton: {
    backgroundColor: colors.primary,
  },
  contentTypeText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  activeContentTypeText: {
    color: '#FFF',
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeFilterTab: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    color: colors.text,
  },
  activeFilterTabText: {
    color: '#FFF',
    fontWeight: '500',
  },
  filterOptionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  activeFilterOption: {
    backgroundColor: `${colors.primary}20`,
  },
  filterOptionText: {
    fontSize: 14,
    color: colors.text,
  },
  activeFilterOptionText: {
    color: colors.primary,
    fontWeight: '500',
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  activeFiltersText: {
    fontSize: 14,
    color: colors.textLight,
  },
  clearFiltersText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  materialsList: {
    padding: 16,
  },
  materialItem: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  materialIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  materialContent: {
    flex: 1,
  },
  materialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  materialDetails: {
    marginBottom: 8,
  },
  materialSubject: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  materialInfo: {
    fontSize: 12,
    color: colors.textLight,
  },
  materialTags: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  materialTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: `${colors.primary}20`,
    marginRight: 8,
  },
  typeTag: {
    backgroundColor: `${colors.secondary}20`,
  },
  materialTagText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  materialSize: {
    fontSize: 12,
    color: colors.textLight,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
});