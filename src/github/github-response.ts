export interface GithubResponse {
  total_count: number;
  incomplete_results: boolean;
  items: Array<{
    id: number;
    name: string;
    full_name: string;
    private: boolean;
    score?: number;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
  }>;
}
