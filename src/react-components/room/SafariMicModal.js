import React from "react";
import { Modal } from "../modal/Modal";
import { Button } from "../input/Button";
import { Column } from "../layout/Column";
import { FormattedMessage } from "react-intl";

export function SafariMicModal() {
  return (
    <Modal title={<FormattedMessage id="safari-mic-modal.title" defaultMessage="マイクの使用許可が必要です" />}>
      <Column center padding>
        <FormattedMessage
          id="safari-mic-modal.message"
          defaultMessage="<p>hubsはSafariにおけるマイクの使用許可を必要としています。</p><p>続けるためにはページを更新し、マイクの使用を許可してください。</p>"
          values={{
            // eslint-disable-next-line react/display-name
            p: chunks => <p>{chunks}</p>
          }}
        />
        <Button preset="accept" onClick={() => location.reload()}>
          <FormattedMessage id="safari-mic-modal.reload-button" defaultMessage="更新する" />
        </Button>
      </Column>
    </Modal>
  );
}
