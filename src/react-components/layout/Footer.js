import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import styles from "./Footer.scss";
import discordLogoUrl from "../../assets/images/discord-logo-small.png";
import { Container } from "./Container";

export function Footer({
  hidePoweredBy,
  showWhatsNewLink,
  showTerms,
  termsUrl,
  showPrivacy,
  privacyUrl,
  showCompanyLogo,
  companyLogoUrl,
  showDiscordBotLink,
  appName
}) {
  return (
    <footer>
      <Container as="div" className={styles.container}>
        <div className={styles.poweredBy}>
          {!hidePoweredBy && (
            <FormattedMessage
              id="footer.powered-by"
              defaultMessage="Powered by <a>Hubs Cloud</a>"
              values={{
                // eslint-disable-next-line react/display-name
                a: chunks => (
                  <a className={styles.link} href="https://hubs.mozilla.com/cloud">
                    {chunks}
                  </a>
                )
              }}
            />
          )}
        </div>
        <nav>
          <ul>
            {showDiscordBotLink && (
              <li>
                <img className={styles.discordLogo} src={discordLogoUrl} />
                <a href="/discord">
                  <FormattedMessage
                    id="home-page.add-to-discord"
                    defaultMessage="Add the {appName} Bot to Discord"
                    values={{
                      appName
                    }}
                  />
                </a>
              </li>
            )}
            {showWhatsNewLink && (
              <li>
                <a href="/whats-new">
                  <FormattedMessage id="footer.whats-new" defaultMessage="バーチャル道頓堀メモ" />
                </a>
              </li>
            )}
            {showTerms && (
              <li>
                <a target="_blank" rel="noopener noreferrer" href={termsUrl}>
                  <FormattedMessage id="footer.terms-of-use" defaultMessage="Terms of Use" />
                </a>
              </li>
            )}
            {showPrivacy && (
              <li>
                <a className={styles.link} target="_blank" rel="noopener noreferrer" href={privacyUrl}>
                  <FormattedMessage id="footer.privacy-notice" defaultMessage="Privacy Notice" />
                </a>
              </li>
            )}
            {showCompanyLogo && (
              <li>
                <img
                  className={styles.companyLogo}
                  src={companyLogoUrl}
                  alt={<FormattedMessage id="footer.logo-alt" defaultMessage="Logo" />}
                />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}

Footer.propTypes = {
  hidePoweredBy: PropTypes.bool,
  showWhatsNewLink: PropTypes.bool,
  showTerms: PropTypes.bool,
  termsUrl: PropTypes.string,
  showPrivacy: PropTypes.bool,
  privacyUrl: PropTypes.string,
  showCompanyLogo: PropTypes.bool,
  companyLogoUrl: PropTypes.string,
  showDiscordBotLink: PropTypes.bool,
  appName: PropTypes.string
};
