import { Component } from "@angular/core";
import { HeadlineNewsComponent } from "../../../../../../shared-library/src/lib/presentation/ui-elements/news-widgets/headline-news/headline-news.component";
import { INews } from "../../../../../../shared-library/src/lib/models/news/INews.model";
import { NewsComponent } from "../../../../../../shared-library/src/lib/presentation/ui-elements/news-widgets/news/news.component";
import { CaseStudyNewsComponent } from "../../../../../../shared-library/src/lib/presentation/ui-elements/news-widgets/case-study-news/case-study-news.component";
import { MediaTextOverlayComponent } from "../../../../../../shared-library/src/lib/presentation/ui-elements/media-text-overlay/media-text-overlay.component";

@Component({
  selector: "app-actuality",
  imports: [
    HeadlineNewsComponent,
    NewsComponent,
    CaseStudyNewsComponent,
    MediaTextOverlayComponent,
  ],
  templateUrl: "./actuality.component.html",
  styleUrl: "./actuality.component.scss",
})
export class ActualityComponent {
  headlineNews: INews = {
    id: 1,
    publishedAt: new Date(),
    category: "Dossier Spécial",
    imageCaption: "Ouverture du nouveau centre de santé IPECA",
    imagePath: "/assets/shared-library/media/actualites/UAT.png",
    title: "IPECA inaugure un nouveau centre de santé à Paris",
    description:
      "Découvrez les services innovants proposés dans notre nouveau centre, ouvert à tous les adhérents dès aujourd'hui.",
    link: "https://www.ipeca.fr/actualites/nouveau-centre-sante-paris",
  };
}
