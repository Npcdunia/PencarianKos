import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },

  kosCard: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
  },

  kosName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },

  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },

  info: {
    marginBottom: 5,
  },

  facilityTitle: {
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 8,
  },

  facilityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  facilityItem: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#eeeeee",
  },

  facilityText: {
    fontSize: 13,
  },
});