import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const TermsAndConditionsScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Điều khoản và điều kiện</Text>
      <Text style={styles.lastUpdated}>Cập nhật gần nhất 12/09/2024</Text>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tóm tắt</Text>
          <Text style={styles.sectionText}>
            Lorem ipsum dolor sit amet consectetur. Viverra semper rutrum ut
            velit et massa ornare in. Odio orci urna imperdiet vel accumsan ut.
            Sapien velit suspendisse nunc facilisis a est tempus egestas sed.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Điều khoản</Text>
          <Text style={styles.sectionText}>
            Lorem ipsum dolor sit amet consectetur. Viverra semper rutrum ut
            velit et massa ornare in. Odio orci urna imperdiet vel accumsan ut.
            Sapien velit suspendisse nunc facilisis a est tempus egestas sed.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Điều khoản</Text>
          <Text style={styles.sectionText}>
            Lorem ipsum dolor sit amet consectetur. Id bibendum viverra
            condimentum at ut eleifend. Elementum ac porttitor phasellus
            lobortis ut consequat sem auctor arcu. Consectetur sed euismod
            maecenas velit euismod at. Eu elit id pellentesque tortor. Nibh
            sagittis tellus consequat nunc.
          </Text>
          <Text style={styles.sectionText}>
            Morbi posuere feugiat cursus consectetur. Ut orci mauris rhoncus
            posuere odio ac turpis sit. Sagittis varius feugiat blandit dolor
            sit tincidunt laoreet mauris aenean. Vestibulum vitae donec vitae
            tempor elit volutpat neque tellus. Urna pulvinar porttitor enim
            vitae aenean viverra a vulputate. Et massa cursus risus viverra
            ipsum integer tincidunt nunc. Convallis posuere tortor quam auctor
            laoreet vitae gravida. Pellentesque a urna maecenas nisl praesent
            tortor.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  lastUpdated: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  content: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});

export default TermsAndConditionsScreen;
