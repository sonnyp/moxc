"use strict";

import { FlatList, View, Text, Switch, TextInput, Picker } from "react-native";

import styles from "../styles";
import { Link } from "../routes";

const NS_X_DATA = "jabber:x:data";

export default function DataForm(props) {
  const { form } = props;
  if (!form) return <View />;

  const title = form.getChildText("title");
  const instructions = form.getChildText("instructions");
  const fields = form.getChildren("field");

  return (
    <View>
      {title && <Text>{title}</Text>}
      {instructions && <Text>{instructions}</Text>}
      {fields.map(field => {
        const { type, label } = field.attrs;
        const key = field.attrs.var;
        const value = field.getChildText("value") || "";
        const options = field.getChildren("option");

        let input = null;

        if (type === "list-single") {
          input = (
            <Picker selectedValue={value} style={{ height: 50, width: 100 }}>
              <Picker.Item label="" value="" />
              {options.map(option => {
                return (
                  <Picker.Item
                    label={option.attrs.label}
                    value={option.getChildText("value") || ""}
                  />
                );
              })}
            </Picker>
          );
        } else if (type === "jid-single") {
          input = (
            <TextInput
              style={styles.input}
              value={value}
              keyboardType="email-address"
              placeholder={label}
            />
          );
        } else if (type === "text-private") {
          input = (
            <TextInput
              style={styles.input}
              value={value}
              secureTextEntry={true}
              placeholder={label}
            />
          );
        } else if (type === "text-single") {
          input = (
            <TextInput style={styles.input} value={value} placeholder={label} />
          );
        } else if (type === "boolean") {
          input = <Switch value={value === "1"} />;
        }

        return (
          <View key={key}>
            <Text>{label}</Text>
            {input}
          </View>
        );
      })}
    </View>
  );
}
