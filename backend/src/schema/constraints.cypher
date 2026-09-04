// Uniqueness constraints
CREATE CONSTRAINT user_id_unique IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE;
CREATE CONSTRAINT concept_id_unique IF NOT EXISTS FOR (c:Concept) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT concept_canonical_unique IF NOT EXISTS FOR (c:Concept) REQUIRE c.canonicalId IS UNIQUE;

// Indexes for fast lookups
CREATE INDEX concept_name_index IF NOT EXISTS FOR (c:Concept) ON (c.name);
CREATE INDEX concept_type_index IF NOT EXISTS FOR (c:Concept) ON (c.type);
CREATE INDEX user_username_index IF NOT EXISTS FOR (u:User) ON (u.username);
