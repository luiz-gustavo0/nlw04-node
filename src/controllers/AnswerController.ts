import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";

class AnswerController {
  async execute(request: Request, response: Response) {
    const { value } = request.params;
    const { u } = request.query;

    const surveysUserRepository = getCustomRepository(SurveyUserRepository);

    const surveyUser = await surveysUserRepository.findOne({
      id: String(u),
    });

    if (!surveyUser) {
      return response
        .status(400)
        .json({ error: "Survey User does not exists" });
    }

    surveyUser.value = Number(value);

    await surveysUserRepository.save(surveyUser);

    return response.json(surveyUser);
  }
}

export { AnswerController };
