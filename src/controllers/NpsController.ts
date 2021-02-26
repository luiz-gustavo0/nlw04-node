import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";

class NpsController {
  async exxecute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveysUserRepository = getCustomRepository(SurveyUserRepository);

    const surveysUser = await surveysUserRepository.find({
      survey_id,
      value: Not(IsNull()),
    });

    const detractors = surveysUser.filter(
      (survey) => survey.value >= 0 && survey.value <= 6
    ).length;

    const passives = surveysUser.filter(
      (survey) => survey.value >= 7 && survey.value <= 8
    ).length;

    const promoters = surveysUser.filter(
      (survey) => survey.value >= 9 && survey.value <= 10
    ).length;

    const totalAnswers = surveysUser.length;

    const calculate = Number(
      (((promoters - detractors) / totalAnswers) * 100).toFixed(2)
    );

    return response.json({
      detractors,
      promoters,
      passives,
      totalAnswers,
      nps: calculate,
    });
  }
}

export { NpsController };
