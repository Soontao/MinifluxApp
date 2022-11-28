import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import * as React from "react";
import { Entry } from "../api/miniflux";
import { appConnect } from "../store";

export interface IContentProps {
  entry: Entry;
}

export interface IContentState {}

class Content extends React.Component<IContentProps, IContentState> {
  constructor(props: IContentProps) {
    super(props);
    this.state = {};
  }

  public render() {
    // TODO: font size configuration
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{this.props.entry.title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div
            style={{ fontSize: "22px" }}
            dangerouslySetInnerHTML={{ __html: this.props.entry.content }}
          />
        </IonContent>
      </IonPage>
    );
  }
}

export default appConnect((state) => state.contentReducer)(Content as any);
