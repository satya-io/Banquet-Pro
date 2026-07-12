import { CosmosClient, Database, Container } from '@azure/cosmos';
import dotenv from 'dotenv';

dotenv.config();

const endpoint = process.env.COSMOS_ENDPOINT || 'https://localhost:8081';
const key = process.env.COSMOS_KEY || '';
const databaseId = process.env.COSMOS_DATABASE || 'banquet-pro-db';

const client = new CosmosClient({ endpoint, key });

let database: Database;

// Container references
let tenantsContainer: Container;
let enquiriesContainer: Container;
let bookingsContainer: Container;
let cateringItemsContainer: Container;
let venueSpacesContainer: Container;
let teamMembersContainer: Container;
let settingsContainer: Container;

const containerDefinitions = [
  { id: 'tenants', partitionKey: '/id' },
  { id: 'enquiries', partitionKey: '/tenantId' },
  { id: 'bookings', partitionKey: '/tenantId' },
  { id: 'cateringItems', partitionKey: '/tenantId' },
  { id: 'venueSpaces', partitionKey: '/tenantId' },
  { id: 'teamMembers', partitionKey: '/tenantId' },
  { id: 'settings', partitionKey: '/tenantId' },
];

export async function initializeCosmosDB(): Promise<void> {
  console.log('🔌 Connecting to Cosmos DB...');
  console.log(`   Endpoint: ${endpoint}`);
  console.log(`   Database: ${databaseId}`);

  // Create database if it doesn't exist
  const { database: db } = await client.databases.createIfNotExists({ id: databaseId });
  database = db;
  console.log(`✅ Database "${databaseId}" ready`);

  // Create containers if they don't exist
  for (const def of containerDefinitions) {
    const { container } = await database.containers.createIfNotExists({
      id: def.id,
      partitionKey: { paths: [def.partitionKey] },
    });
    console.log(`   📦 Container "${def.id}" ready`);

    switch (def.id) {
      case 'tenants': tenantsContainer = container; break;
      case 'enquiries': enquiriesContainer = container; break;
      case 'bookings': bookingsContainer = container; break;
      case 'cateringItems': cateringItemsContainer = container; break;
      case 'venueSpaces': venueSpacesContainer = container; break;
      case 'teamMembers': teamMembersContainer = container; break;
      case 'settings': settingsContainer = container; break;
    }
  }

  console.log('✅ All Cosmos DB containers initialized');
}

export function getContainer(name: string): Container {
  switch (name) {
    case 'tenants': return tenantsContainer;
    case 'enquiries': return enquiriesContainer;
    case 'bookings': return bookingsContainer;
    case 'cateringItems': return cateringItemsContainer;
    case 'venueSpaces': return venueSpacesContainer;
    case 'teamMembers': return teamMembersContainer;
    case 'settings': return settingsContainer;
    default: throw new Error(`Unknown container: ${name}`);
  }
}

export { database, client };
