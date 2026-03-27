#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String};

// Define the structure of a Podcast Episode
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Episode {
    pub creator: Address,
    pub title: String,
    pub audio_uri: String, // Typically an IPFS CID or Arweave hash
}

// Define the keys used for contract storage
#[contracttype]
pub enum DataKey {
    EpisodeCount,
    Episode(u32),
}

#[contract]
pub struct PodcastPlatformContract;

#[contractimpl]
impl PodcastPlatformContract {
    /// Publishes a new podcast episode.
    /// 
    /// # Arguments
    /// * `creator` - The address of the podcaster publishing the episode.
    /// * `title` - The title of the episode.
    /// * `audio_uri` - The decentralized storage link to the audio file.
    pub fn publish(env: Env, creator: Address, title: String, audio_uri: String) -> u32 {
        // Ensure the creator has signed and authorized this transaction
        creator.require_auth();

        // Retrieve the current episode count (defaulting to 0 if none exist)
        let mut count: u32 = env.storage().instance().get(&DataKey::EpisodeCount).unwrap_or(0);
        
        // Increment the ID for the new episode
        count += 1;

        // Construct the episode record
        let episode = Episode {
            creator,
            title,
            audio_uri,
        };

        // Store the episode persistently on the Stellar network
        env.storage().persistent().set(&DataKey::Episode(count), &episode);
        
        // Update the global episode count
        env.storage().instance().set(&DataKey::EpisodeCount, &count);

        count // Return the new episode ID
    }

    /// Retrieves a specific podcast episode by its ID.
    pub fn get_episode(env: Env, id: u32) -> Episode {
        env.storage()
            .persistent()
            .get(&DataKey::Episode(id))
            .expect("Episode not found")
    }

    /// Returns the total number of episodes published on the platform.
    pub fn get_total_episodes(env: Env) -> u32 {
        env.storage().instance().get(&DataKey::EpisodeCount).unwrap_or(0)
    }
}
