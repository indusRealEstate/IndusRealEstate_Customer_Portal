import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Configuration, OpenAIApi } from "openai";
import { environment } from "environments/environment";

@Injectable({ providedIn: "root" })
export class OpenAiServices {
  readonly configuration = new Configuration({
    apiKey: environment.OPEN_AI_API_KEY,
  });

  readonly openai = new OpenAIApi(this.configuration);

  constructor(public http: HttpClient) {}

  async getDataFromOpenAPI(text: string) {
    const completion = await this.openai.createCompletion({
      model: "text-davinci-003",
      prompt: text,
      max_tokens: 256
    });

    return completion.data.choices[0].text;
  }

  async createImageOpenAI(text: string) {
    const completion = await this.openai.createImage({
      prompt : text,
      n : 1,
      size : "1024x1024",
    });

    return completion.data.data[0]["url"];
  }
}
