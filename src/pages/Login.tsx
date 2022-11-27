import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonToast,
} from "@ionic/react";
import React from "react";
import { MinifluxClient } from "../api";
import { useAppDispatch } from "../store";
import { setupUser } from "../store/features/user";

export interface ILoginProps {}

export default function Login(props: ILoginProps) {
  const urlRef = React.createRef<HTMLIonInputElement>();
  const tokenRef = React.createRef<HTMLIonInputElement>();
  const dispatch = useAppDispatch();

  const [present, dismiss] = useIonLoading();
  const [presentToast] = useIonToast();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton
              onClick={async () => {
                const options = {
                  url: urlRef.current?.value as string,
                  token: tokenRef.current?.value as string,
                };
                present("connecting");
                try {
                  const client = new MinifluxClient(options);
                  await client.validate();
                  dispatch(setupUser(options));
                } catch (error: any) {
                  presentToast(`failed to login ${error.message}`);
                } finally {
                  dismiss();
                }
              }}
            >
              Login
            </IonButton>
          </IonButtons>
          <IonTitle>Setup</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="stacked">Miniflux</IonLabel>
            <IonInput
              type="url"
              ref={urlRef}
              value="https://miniflux.local.cn05.fornever.org:59443"
              placeholder="miniflux instance url"
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Token</IonLabel>
            <IonInput type="password" ref={tokenRef}></IonInput>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
}
