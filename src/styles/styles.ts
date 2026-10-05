import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0fdf4",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },

  kosCard: {
    backgroundColor: "#2fe3f0",
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
  },

  kosName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#ffffff",
  },

  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#ffffff",
  },

  info: {
    marginBottom: 5,
    color: "#ffffff",
  },

  facilityTitle: {
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 8,
    color: "#ffffff",
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
    backgroundColor: "#dcfce7",
  },

  facilityText: {
    fontSize: 13,
    color: "#166534",
  },
});
