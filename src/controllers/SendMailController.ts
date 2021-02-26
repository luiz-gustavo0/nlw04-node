import { Request, Response } from "express";
import { resolve } from "path";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";
import { UsersRepository } from "../repositories/UserRepository";
import SendMailService from "../services/SendMailService";

class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUserRepository = getCustomRepository(SurveyUserRepository);

    const user = await usersRepository.findOne({ email });
    if (!user) {
      return response.status(400).json({
        error: "User does not exists.",
      });
    }

    const survey = await surveysRepository.findOne({ id: survey_id });
    if (!survey) {
      return response.status(400).json({
        error: "Survey does not exists.",
      });
    }

    const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

    const surveyUserExixts = await surveysUserRepository.findOne({
      where: { user_id: user.id, value: null },
      relations: ["user", "survey"],
    });

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: "",
      link: process.env.URL_MAIL,
    };

    if (surveyUserExixts) {
      variables.id = surveyUserExixts.id;
      await SendMailService.execute(email, survey.title, variables, npsPath);
      return response.json(surveyUserExixts);
    }

    const surveyUser = surveysUserRepository.create({
      user_id: user.id,
      survey_id,
    });

    await surveysUserRepository.save(surveyUser);

    // Enviar email para o usuario
    variables.id = surveyUser.id;

    await SendMailService.execute(email, survey.title, variables, npsPath);

    return response.json(surveyUser);
  }
}

export { SendMailController };
