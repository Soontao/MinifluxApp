import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import * as React from "react";
import { Entry, MinifluxClient } from "../api/miniflux";
import { appConnect } from "../store";
import { bookmark } from "ionicons/icons";

export interface IContentProps {
  entry: Entry;
  credential: { url: string; token: string };
}

export interface IContentState {
  showToast: boolean;
  toastMessage: string;
}

class Content extends React.Component<IContentProps, IContentState> {
  private _client: MinifluxClient;

  constructor(props: IContentProps) {
    super(props);
    this.state = {
      showToast: false,
      toastMessage: "",
    };
    this._client = new MinifluxClient(props.credential);
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
        <IonContent fullscreen className="ion-padding">
          <div
            style={{ fontSize: "22px" }}
            dangerouslySetInnerHTML={{ __html: this.props.entry.content }}
          />
          <IonFab
            className="ion-padding"
            slot="fixed"
            horizontal="end"
            vertical="bottom"
          >
            <IonFabButton
              disabled={this.props.entry.starred}
              onClick={() => {
                this._client.toggleBookmark(this.props.entry.id).finally(() => {
                  this.setState({
                    showToast: true,
                    toastMessage: "Bookmark done",
                  });
                });
              }}
            >
              <IonIcon icon={bookmark}></IonIcon>
            </IonFabButton>
          </IonFab>
          <IonToast
            isOpen={this.state.showToast}
            onDidDismiss={() =>
              this.setState({ showToast: false, toastMessage: "" })
            }
            message={this.state.toastMessage}
            duration={800}
          />
        </IonContent>
      </IonPage>
    );
  }
}

export default appConnect((state) => ({
  entry: state.contentReducer.entry,
  credential: state.userReducer.credential,
}))(Content as any);
