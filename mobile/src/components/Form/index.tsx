import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import { ArrowLeft } from "phosphor-react-native";
import * as FileSystem from "expo-file-system";

import { FeedbackType } from "../../components/Widget";
import { Button } from "../../components/Button";
import { ScreenshotButton } from "../../components/ScreenshotButton";
import { captureScreen } from "react-native-view-shot";

import { api } from "../../libs/api";
import { styles } from "./styles";
import { theme } from "../../theme";
import { feedbackTypes } from "../../utils/feedbackTypes";

interface Props {
  feedbackType: FeedbackType;
  onFeedbackCanceled: () => void;
  onFeedbackSent: () => void;
}

export function Form({
  feedbackType,
  onFeedbackCanceled,
  onFeedbackSent,
}: Props) {
  const [isSendingFeedback, SetIsSendingFeedback] = useState(false);
  const [screenshoot, setScreenshot] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  const feedbackTypeInfo = feedbackTypes[feedbackType];

  function handleScreenshot() {
    captureScreen({
      format: "jpg",
      quality: 0.8,
    })
      .then((uri) => setScreenshot(uri))
      .catch((error) => console.error(error));
  }

  function handleScreenshotRemove() {
    setScreenshot(null);
  }

  async function handleSendFeedback() {
    if (isSendingFeedback) return;

    SetIsSendingFeedback(true);

    const screenshotBase64 =
      screenshoot &&
      await FileSystem.readAsStringAsync(screenshoot, { encoding: "base64" });

    try {
      await api.post(`/feedbacks`, {
        type: feedbackType,
        screenshoot: `data:image/base64, ${screenshotBase64}`,
        comment,
      });

      onFeedbackSent();
    } catch (error) {
      console.log(error);
      SetIsSendingFeedback(false);
    }
  }

  return (
    <View style={styles.constainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onFeedbackCanceled}>
          <ArrowLeft
            size={24}
            weight="bold"
            color={theme.colors.text_secondary}
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Image source={feedbackTypeInfo.image} style={styles.image} />
          <Text style={styles.titleText}>{feedbackTypeInfo.title}</Text>
        </View>
      </View>

      <TextInput
        multiline
        style={styles.input}
        placeholder="Algo não está funcionando bem? Queremos corrigir. Conte com detalhes o que está acontecendo..."
        placeholderTextColor={theme.colors.text_secondary}
        onChangeText={setComment}
      ></TextInput>

      <View style={styles.footer}>
        <ScreenshotButton
          onTakeShot={handleScreenshot}
          onRemoveShot={handleScreenshotRemove}
          screenshot={screenshoot}
        />
        <Button onPress={handleSendFeedback} isLoading={isSendingFeedback} />
      </View>
    </View>
  );
}
