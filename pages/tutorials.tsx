import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import {
  ColumnsWrapper,
  Footer,
  Meta,
  PageHeader,
  PageScrollableContent,
  SideContent,
  TableOfContents
} from '~/components'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { TutorialSection, TutorialSectionProps } from '~/components/TutorialSection/TutorialSection'
import { mobileAndTabletCheck } from '~/lib/utility/deviceDetection'

type ServerProps = Page

type SectionProps = {
  sectionTitle: string
  sectionItems: TutorialSectionProps[]
}

// const notAvailableTextMobile = `Feature not available on mobile.`
const notAvailableTextWeb = `Feature not available on web.`

export default function Tutorials(props: ServerProps) {
  /* Initialize */

  const { t } = useTranslation()
  const sections = generateSections(t)
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  /* useEffects */

  useEffect(() => {
    const isMobileOrTablet = mobileAndTabletCheck()
    setIsMobileOrTablet(isMobileOrTablet)
    setIsLoading(false)
  }, [])

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.tutorials}`,
    description: t('pages-tutorials_Description'),
    title: t('pages-tutorials_Title')
  }

  const generateTutorialSectionElements = () => {
    const tutorialItemsFlatList = []
    for (const section of sections) {
      for (const sectionItem of section.sectionItems) {
        tutorialItemsFlatList.push(sectionItem)
      }
    }

    return tutorialItemsFlatList.map((item, index) => (
      <TutorialSection
        defaultTypeSelected={isMobileOrTablet ? 'mobile' : 'web'}
        description={item.description}
        id={item.id}
        key={`tutorial-section-${index}`}
        mobileExplanation={item.mobileExplanation}
        mobilePreviewVideoEmbed={item.mobilePreviewVideoEmbed}
        title={item.title}
        webExplanation={item.webExplanation}
        webPreviewVideoEmbed={item.webPreviewVideoEmbed}
      />
    ))
  }

  return (
    <>
      <Meta
        description={meta.description}
        ogDescription={meta.description}
        ogTitle={meta.title}
        ogType='website'
        ogUrl={meta.currentUrl}
        robotsNoIndex={false}
        title={meta.title}
        twitterDescription={meta.description}
        twitterTitle={meta.title}
      />
      <PageHeader text={t('Tutorials')} />
      <PageScrollableContent>
        <ColumnsWrapper
          mainColumnChildren={
            <div className='text-page'>
              <TableOfContents sections={sections} />
              <hr />
              <div className='tutorial-sections'>
                <h2>Features</h2>
                {!isLoading && generateTutorialSectionElements()}
              </div>
            </div>
          }
          sideColumnChildren={<SideContent />}
        />
        <Footer />
      </PageScrollableContent>
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale } = ctx

  const defaultServerProps = await getDefaultServerSideProps(ctx, locale)

  const serverProps: ServerProps = {
    ...defaultServerProps
  }

  return { props: serverProps }
}

const generateSections = (t: any) =>
  [
    {
      sectionTitle: `Account`,
      sectionItems: [
        {
          title: `Delete account`,
          id: `account-delete`,
          description: `Permanently delete your Podverse account.`,
          mobileExplanation: `<ol>
          <li>Tap the More tab.</li>
          <li>Tap Settings, then Account.</li>
          <li>Tap the Delete Account button, then follow the directions on screen.</li>
          </ol>`,
          mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).account.delete.mobile,
          webExplanation: `<ol>
          <li>To permanently delete your account, click on the profile drop down button.</li>
          <li>Select Settings.</li>
          <li>Click on the Delete My Account button, then follow the directions on screen.</li>
          </ol>`
          // webPreviewVideoEmbed: PV.PreviewVideoEmbeds(t).account.delete.web
        }
      ]
    },
    {
      sectionTitle: `Chapters`,
      sectionItems: [
        {
          title: `Play chapters`,
          id: `episodes-chapters`,
          description: `Navigate through chapters on supported podcasts to quickly jump between segments of an episode.`,
          mobileExplanation: `<ol>
          <li>Tap the Miniplayer to expand it.</li>
          <li>Swipe left until you arrive at the Chapters section.</li>
          <li>From here you can jump to chapters the Podcaster has labeled on the episode.</li>
          </ol>`,
          mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).chapters.mobile,
          webExplanation: `<ol>
          <li>Start on the Podcasts page by clicking the Podcasts tab on the left navigation panel.</li>
          <li>Search for or click on the podcast to navigate to its podcast page.</li>
          <li>Expand an episode by clicking on its episode card.</li>
          <li>Click on the Chapters heading to expand the list of chapters for that episode.</li>
          <li>You can click the play button next to each chapter to jump directly to that portion of the episode.</li>
          </ol>`,
          webPreviewVideoEmbed: PV.PreviewVideoEmbeds(t).chapters.web
        }
      ]
    },
    {
      sectionTitle: `Clips`,
      sectionItems: [
        {
          title: `Create a clip`,
          id: `clips-create`,
          description: `Create a clip of the podcast you are listening to that can be shared with anyone. NOTE: If a podcast inserts dynamic ads, then the timestamps of a clip will not stay exactly accurate.`,
          mobileExplanation: `<ol>
          <li>Tap the Miniplayer to expand it, then tap the Scissors at the top of the screen. Here you can create a clip by assigning a start time and an optional end time.</li>
          <li>Tap the Start Time button to change it to the current time of the episode.</li>
          <li> Optionally, tap the End Time button when the relevant part of your clip is finished.</li>
          <li>If you want your clip to remain private, tap the Public button and select Only with Link.</li>
          <li>Tap Save Clip when you are done. To view your Clips, tap the My Library tab, then tap My Clips.</li>
          </ol>`,
          mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).clips.create.mobile,
          webExplanation: `<ol>
          <li>While the episode you would like to make a clip for is loaded in the miniplayer at the bottom of the screen, click on the Scissor icon near the bottom right to begin making a Clip</li>
          <li>From here, you can Title your clip and enter a Start and End time.</li>
          <li>Before clicking Save to publish your clip, you can click on the Public button at the top right and switch it to Private if you want your clip to only work with a direct link.</li>
          <li>After clicking Save, your new Clip URL will display.</li>
          <li>To find your Clips later, click on the My Profile tab on the left, then click the filter and sort by Clips.</li>
          </ol>`,
          webPreviewVideoEmbed: PV.PreviewVideoEmbeds(t).clips.create.web
        },
        {
          title: `Delete a clip`,
          id: `clip-delete`,
          description: `Delete a clip you've created.`,
          mobileExplanation: `<ol>
          <li>Tap the My Library tab, then tap My Clips.</li>
          <li>Find the clip you want to delete, then tap the three-dot menu button on the right.</li>
          <li>Tap Delete Clip to delete your clip.</li>
          </ol>`,
          // mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).clips.delete.mobile,
          webExplanation: `<ol>
          <li>To delete a clip, first navigate to My Profile, then sort by Clips.</li>
          <li>Find the clip you would like to delete, then click the three-dot menu button to the right of it.</li>
          <li>Click "Delete Clip" and confirm to delete the clip.</li>
          </ol>`
          // webPreviewVideoEmbed: PV.PreviewVideoEmbeds(t).clips.delete.web
        }
      ]
    },
    {
      sectionTitle: `Cross-App Comments`,
      sectionItems: [
        {
          title: `Read cross-app comments`,
          id: `cross-comments`,
          description: `View cross-app comments and log in to reply.`,
          mobileExplanation: `<ol>
          <li>Tap the Miniplayer to expand it.</li>
          <li>Swipe left until you arrive at the Comments section.</li>
          <li>Tapping a comment will open it in a new window where you can log in to reply.</li>
          </ol>`,
          mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).crossAppComments.mobile,
          webExplanation: `<ol>
          <li>Start on the Podcasts page by clicking the Podcasts tab on the left navigation panel.</li>
          <li>Search for or click on the podcast to navigate to its podcast page.</li>
          <li>Expand an episode by clicking on its episode card.</li>
          <li>Click on the Comments heading to show comments for that episode.</li>
          <li>Clicking on a comment will open a separate web page directly to that comment where you can log in to participate in the discussion.</li>
          </ol>`,
          webPreviewVideoEmbed: PV.PreviewVideoEmbeds(t).crossAppComments.web
        }
      ]
    },
    {
      sectionTitle: `Custom RSS Feeds`,
      sectionItems: [
        {
          title: `Add custom RSS feed`,
          id: `add-rss`,
          description: `Add RSS feeds directly to listen to your favorite podcasts.`,
          mobileExplanation: `<ol>
          <li>Tap the More Tab, then tap Add Custom RSS Feed.</li>
          <li>Paste the RSS link for the podcast you'd like to add in the text box here, then tap Save.</li>
          <li>You will be redirected to the podcast screen and automatically subscribed to it.</li>
          </ol>`,
          mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).rss.add.mobile,
          webExplanation: notAvailableTextWeb
        },
        {
          title: `Add custom RSS feed with username and password`,
          id: `add-rss-password`,
          description: `Add private RSS feeds directly to listen to your favorite podcasts.`,
          mobileExplanation: `<ol>
          <li>Tap the More Tab, then tap Add Custom RSS Feed.</li>
          <li>Paste the RSS link for the podcast you'd like to add in the text box here, then tap the Include username and password button.</li>
          <li>Text fields for Username and Password will appear below the RSS link. Enter your username and password for your premium podcast feed, then tap Save.</li>
          <li>You will be redirected to the podcast screen and automatically subscribed to it.</li>
          </ol>`,
          mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).rss.addWithLogin.mobile,
          webExplanation: notAvailableTextWeb
        }
      ]
    },
    {
      sectionTitle: `Episodes`,
      sectionItems: [
        {
          title: `Download episodes`,
          id: `episodes-download`,
          description: `Download episodes to easily access them later offline.`,
          mobileExplanation: `<ol>
          <li>Starting from the podcast page of your choice, tap the download button on the right side of the episode you'd like to download.</li>
          <li>To view your downloaded episodes on the podcast's page: tap the filter button, then sort by Downloaded.</li>
          <li>To view your download progress, tap the My Library tab, then tap Active Downloads.</li>
          </ol>`,
          mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).episodes.download.mobile,
          webExplanation: notAvailableTextWeb
        },
        {
          title: `Delete all downloaded data`,
          id: `delete-all-downloaded`,
          description: `Delete all downloaded data.`,
          mobileExplanation: `<ol>
          <li>Tap the More tab.</li>
          <li>Tap "Settings", then "Downloads"</li>
          <li>Tap "Delete downloaded episodes" to clear up storage space.</li>
          </ol>`,
          mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).episodes.download.delete.mobile,
          webExplanation: notAvailableTextWeb
        },
        {
          title: `Turn on/off auto download episodes`,
          id: `toggle-auto-download`,
          description: `Enable or disable automatic downloads for new episodes.`,
          mobileExplanation: `<ol>
          <li>Start by navigating to the podcast you would like to enable or disable auto download for.</li>
          <li>Once you are subscribed, a new toggle switch appears to the right of the subscribe button.</li>
          <li>Click the Auto toggle button to enable or disable automatic downloads for new episodes of the podcast.</li>
          </ol>`,
          mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).episodes.download.auto.mobile,
          webExplanation: notAvailableTextWeb
        },
        {
          title: `Mark an episode as played or unplayed`,
          id: `episodes-played`,
          description: `Mark episodes as played or unplayed to keep track of your progress.`,
          mobileExplanation: `<ol>
          <li>From the Podcast page of your choice, tap the three-dot menu button next to an episode.</li>
          <li>Tap Mark as Played.</li>
          <li>A green checkmark will appear next to the episode, indicating you've already played it.</li>
          <li>To remove the checkmark, tap the three-dot menu button again and select Mark as Unplayed.</li>
          </ol>`,
          mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).markAsPlayed.mobile,
          webExplanation: `<ol>
          <li>From the Podcast page of your choice, click the three-dot menu button next to the episode you want to mark as Played or Unplayed.</li>
          <li>Click "Mark as Played" or "Mark as Unplayed" to toggle whether the episode appears with the green checkmark or not.</li>
          </ol>`,
          webPreviewVideoEmbed: PV.PreviewVideoEmbeds(t).markAsPlayed.web
        }
      ]
    },
    {
      sectionTitle: `History`,
      sectionItems: [
        {
          title: `Delete a history item`,
          id: `history-item-delete`,
          description: `Remove individual items from your history.`,
          mobileExplanation: `<ol>
          <li>Tap the My Library tab, then tap History.</li>
          <li>Tap Remove at the top right of the screen to begin removing history. An X will appear next to each item.</li>
          <li>Tap the X next to each item you want removed from your history. Tap Done on the top right when you are finished.</li>
          </ol>`,
          mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).history.deleteitem.mobile,
          webExplanation: `<ol>
          <li>Click on the History button on the left navigation page to view your history.</li>
          <li>To remove individual items from your history, click on the X to the right of the entry.</li>
          </ol>`
          // webPreviewVideoEmbed: PV.PreviewVideoEmbeds(t).history.deleteitem.web
        },
        {
          // Delete History
          title: `Delete all history items`,
          id: `history-delete`,
          description: `Clear you entire Podverse history.`,
          mobileExplanation: `
          <li>Clearing your entire history at once is not available on mobile at this time.</li>
          `, //TODO
          // mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).history.deleteall.mobile,
          webExplanation: `<ol>
          <li>Click on the History button on the left navigation page to view your history.</li>
          <li>To clear your entire history, click the Edit button at the top right of the window, then click Remove All and confirm.</li>
          </ol>`
          // webPreviewVideoEmbed: PV.PreviewVideoEmbeds(t).history.deleteall.web
        }
      ]
    },
    {
      sectionTitle: `Playlists`,
      sectionItems: [
        {
          title: `Create a playlist`,
          id: `playlists-create`,
          description: `Create playlists of episodes and clips and share them with anyone.`,
          mobileExplanation: `<ol>
          <li>Playlists can be made up of both Podcast Episodes and Podcast Clips.</li>
          <li>From the Podcast page, tap the three-dot menu button next to an episode or clip.</li>
          <li>Tap the Add to Playlist button.</li>
          <li>Here you can select New to create a new playlist and title it, or select an existing Playlist to add to.</li>
          <li>Repeat this process for as many episodes or clips as you like.</li>
          <li>To view your playlists, tap the My Library tab, then tap Playlists.</li>
          </ol>`,
          mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).playlists.create.mobile,
          webExplanation: `<ol>
          <li>Episodes can be added to a Playlist from any Podcast page. Start by navigating to a Podcast you would like to add episodes of to a Playlist.
          <li>On the bottom right of each episode in the list are three dots. Click on the three dots to expand more options, then click Add to Playlist</li>
          <li>From here, you can click "Create Playlist". You will be prompted to give your new playlist a name.</li>
          <li>After clicking OK, your new playlist will appear in the list with 0 items.</li>
          <li>You can then click on your new playlist to add the episode you are selecting to it. If you want to add this episode to other playlists at the same time, you can also do that here before closing the pop-up window.</li>
          <li>To find your Playlists later, click on the Playlists tab on the left side of the page.</li>
          </ol>`,
          webPreviewVideoEmbed: PV.PreviewVideoEmbeds(t).playlists.create.web
        },
        {
          title: `Add or remove playlist items`,
          id: `playlists-edit`,
          description: `Add or remove an item from a playlist.`,
          mobileExplanation: `<ol>
          <li>Tap the More tab.</li>
          <li>Tap Add to Playlist and select the Playlist you want to add the item to.</li>
          <li>To remove items, tap the My Library tab, tap Playlists, and select the playlist you want to edit.</li>
          <li>Tap the pencil icon to begin editing your playlist, then tap Remove.</li>
          <li>Tap the X next to each item you want to remove from your playlist, then tap Done when you're finished.</li>
          </ol>`,
          mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).playlists.edit.mobile,
          webExplanation: `<ol>
          <li>Click the More tab.</li>
          <li>Click Add to Playlist and select the Playlist you want to add the item to.</li>
          <li>To remove items, click the Playlist button on the left navigation pane and select the playlist you would like to edit.</li>
          <li>Click on the Edit button at the top right to enable editing mode.</li>
          <li>Click on the X next to a playlist entry to remove it.</li>
          </ol>`
          // webPreviewVideoEmbed: PV.PreviewVideoEmbeds(t).playlists.edit.web
        },
        {
          title: `Delete playlist`,
          id: `playlists-delete`,
          description: `Delete a created playlist.`,
          mobileExplanation: `<ol>
          <li>Deleting an entire playlist is unavailable on Mobile at this time.</li>
          </ol>`,
          // mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).playlists.delete.mobile,
          webExplanation: `<ol>
          <li>Click the Playlist button on the left navigation pane and select the playlist you would like to delete.</li>
          <li>Click on the Edit button at the top right to enable editing mode.</li>
          <li>Click on the Delete button that appears and confirm to delete the entire playlist.</li>
          </ol>`
          // webPreviewVideoEmbed: PV.PreviewVideoEmbeds(t).playlists.delete.web
        }
      ]
    },
    {
      sectionTitle: `Podcast`,
      sectionItems: [
        {
          title: `Subscribe to a podcast`,
          id: `podcasts-subscribe`,
          description: `Subscribe to podcasts to easily access them later.`,
          mobileExplanation: `<ol>
          <li>Starting from the Podcasts Tab, tap the search bar and type in the name of a podcast. A list will appear below the search bar.</li>
          <li>Tap the podcast you want from the list to go to its page, then tap the Subscribe button to subscribe.</li>
          <li>To view your subscriptions: tap the Podcasts Tab, then tap the Filter button and filter by Subscribed. Your subscribed podcasts will appear in the list.</li>
          `,
          mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).podcasts.subscribe.mobile,
          webExplanation: `<ol>
          <li>Start on the Podcasts page by clicking the Podcasts tab on the left navigation panel.</li>
          <li>Click on the search bar and search by typing in the name of a podcast you would like to subscribe to.</li>
          <li>Click on the podcast you are looking for to navigate to its podcast page.</li>
          <li>On the right side of the page you will find a Subscribe button. Click it to subscribe.</li>
          <li>You can find your subscribed podcasts by navigating back to the Podcasts tab and changing the filter to show Subscribed podcasts.</li>
          `,
          webPreviewVideoEmbed: PV.PreviewVideoEmbeds(t).podcasts.subscribe.web
        }
      ]
    },
    {
      sectionTitle: `Profiles`,
      sectionItems: [
        {
          title: `Subscribe to a profile`,
          id: `profiles-subscribe`,
          description: `Subscribe to another user's profile.`,
          mobileExplanation: `
          <li>Subscribing to a profile from a link is not available on mobile at this time.</li>
          `, //TODO
          // mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).profiles.subscribe.mobile,
          webExplanation: `<ol>
          <li>To visit a public profile page, you'll need a direct link to it.</li>
          <li>You can find your own profile page URL by clicking My Profile on the left navigation pane and copying the URL at the top of the browser. To subscribe to another user's profile, follow the link they provide you.</li>
          <li>Once you're on the profile page, click Subscribe.</li>
          <li>You can find profiles you've subscribed to on your Profiles page, located on the left navigation pane.</li>
          </ol>`,
          webPreviewVideoEmbed: PV.PreviewVideoEmbeds(t).profiles.subscribe.web
        }
      ]
    },
    {
      sectionTitle: `Queue`,
      sectionItems: [
        {
          title: `Add episode or clip to queue`,
          id: `queue-add`,
          description: `Add an item to your queue.`,
          mobileExplanation: `<ol>
          <li>From the Clips tab, tap the three-dot menu button next to the clip.</li>
          <li>Tap "Queue: Next" or "Queue: Last" to queue up the episode either next or last.</li>
          </ol>`,
          // mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).queue.add.mobile,
          webExplanation: `<ol>
          <li>From the Clips tab, Click the three-dot menu button next to the clip.</li>
          <li>Click "Queue: Next" or "Queue: Last" to queue up the episode either next or last.</li>
          </ol>`
          // webPreviewVideoEmbed: PV.PreviewVideoEmbeds(t).queue.add.web
        }
      ]
    },
    {
      sectionTitle: `Sleep Timer`,
      sectionItems: [
        {
          title: `Set sleep timer`,
          id: `sleep-timer`,
          description: `Set a sleep timer to pause playback when the timer runs out.`,
          mobileExplanation: `<ol>
          <li>Tap the Miniplayer to expand it</li>
          <li>Tap the Crescent Moon at the bottom left of the screen.</li>
          <li>Input a desired time, then tap Start Timer to activate it.</li>
          <li>Podverse will pause the podcast you're listening to once the timer is up.</li>
          </ol>`,
          mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).sleepTimer.mobile,
          webExplanation: notAvailableTextWeb,
          webPreviewVideoEmbed: PV.PreviewVideoEmbeds(t).sleepTimer.web
        }
      ]
    },
    {
      sectionTitle: `Transcripts`,
      sectionItems: [
        {
          title: `Read episode transcripts`,
          id: `episodes-transcripts`,
          description: `View episode transcripts when supported and navigate through them.`,
          mobileExplanation: `<ol>
          <li>Tap on the Miniplayer to expand it.</li>
          <li>Swipe left until you arrive at the Transcript section.</li>
          <li>Here you can scroll or search through the provided transcript and tap on sections of text to jump directly to where they were said in the Episode.</li>
          </ol>`,
          mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).transcripts.mobile,
          webExplanation: `<ol>
          <li>Click on the Miniplayer to expand it.</li>
          <li>Click the name of the episode to open directly to that episode's page.</li>
          <li>Click Transcripts to expand and view the episode's Transcript.</li>
          <li>Here you can scroll or search through the provided transcript and click on sections of text to jump directly to where they were said in the Episode.</li>
          </ol>`,
          webPreviewVideoEmbed: PV.PreviewVideoEmbeds(t).transcripts.web
        }
      ]
    },
    {
      sectionTitle: `Value for Value (V4V)`,
      sectionItems: [
        {
          title: `Enable value-4-value`,
          id: `v4v`,
          description: `Enable Value-4-Value to send Bitcoin donations and boostagrams to podcasters.`,
          mobileExplanation: `<ol>
          <li>From the More tab, tap Value for value (V4V)</li>
          <li>Optionally, toggle "Show lightning icons..." to make it easier to identify V4V supported podcasts.</li>
          <li>Tap Alby, then connect wallet.</li>
          <li>Login to your Alby account, then authorize Podverse.</li>
          <li>You can now set your Boost amount and Boost podcasts.</li>
          <li>To Boost a podcast, open the miniplayer while the episode you would like to boost is playing, then select BOOST or BOOSTAGRAM.</li>
          </ol>`,
          mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).value4Value.bitcoin.mobile,
          webExplanation: `<ol>
          <li>You need a WebLN-compatible browser extension (like Alby) to send boosts.</li>
          <li>Once you've set up your browser extension, navigate to a V4V enabled podcast page.</li>
          <li> You'll find the Value for Value widget on the right side of the podcast page.</li>
          </ol>`
          // webPreviewVideoEmbed: PV.PreviewVideoEmbeds(t).value4Value.bitcoin.web
        }
      ]
    },
    {
      sectionTitle: `Videos`,
      sectionItems: [
        {
          title: `Play videos`,
          id: `videos-playback`,
          description: `Watch podcasts that support video playback.`,
          mobileExplanation: `<ol>
          <li>Select a video podcast and play an episode. The video will begin playing in the miniplayer.</li>
          <li>To see the video in full screen, tap the miniplayer to expand it, then tap the Full Screen button at the top right of the video box.`,
          mobilePreviewVideoEmbed: PV.PreviewVideoEmbeds(t).videos.mobile,
          webExplanation: `<ol>
          <li>Start on the Podcasts page by clicking the Podcasts tab on the left navigation panel.</li>
          <li>Click on the search bar and search by typing in the name of a podcast with video.</li>
          <li>Click on the podcast you are looking for to navigate to its podcast page.</li>
          <li>Select an episode from the list below by clicking the play button below the episode description.</li>
          <li>The podcast will begin playing and the video will automatically display in a mini window on the bottom right of the browser.</li>
          <li>To view the video in full screen, click the Expand icon on the bottom right of the media player, then the full screen button on the bottom of the video.</li>
          </ol>`,
          webPreviewVideoEmbed: PV.PreviewVideoEmbeds(t).videos.web
        }
      ]
    }
  ] as SectionProps[]
