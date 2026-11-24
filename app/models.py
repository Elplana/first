from typing import Optional
from pydantic import BaseModel, Field, model_validator


class PlayerPredictionRequest(BaseModel):
    league: str = Field(
        default="Premier League",
        description="League name (Premier League, LaLiga, Serie A, Bundesliga, Ligue 1, Eredivisie, Liga Portugal, Super Lig)"
    )
    position: str = Field(
        default="F",
        description="Playing position: F (Forward), M (Midfielder), D (Defender), G (Goalkeeper)"
    )
    minutes_played: float = Field(default=1800.0, ge=0.0, description="Total minutes played in the season")
    appearances: int = Field(default=20, ge=0, description="Total match appearances")
    matches_started: int = Field(default=18, ge=0, description="Matches started in starting XI")
    rating: float = Field(default=7.2, ge=1.0, le=10.0, description="Average match rating (1.0 to 10.0)")
    goals: int = Field(default=8, ge=0, description="Total goals scored")
    assists: int = Field(default=4, ge=0, description="Total assists")
    expected_goals: float = Field(default=7.5, ge=0.0, description="Expected goals (xG)")
    expected_assists: float = Field(default=3.8, ge=0.0, description="Expected assists (xA)")
    total_shots: int = Field(default=45, ge=0, description="Total shots taken")
    shots_on_target: int = Field(default=20, ge=0, description="Shots on target")
    tackles: int = Field(default=15, ge=0, description="Total tackles made")
    interceptions: int = Field(default=10, ge=0, description="Total interceptions made")
    saves: int = Field(default=0, ge=0, description="Total saves (for goalkeepers)")
    yellow_cards: int = Field(default=2, ge=0, description="Yellow cards received")
    red_cards: int = Field(default=0, ge=0, description="Red cards received")

    # Optional Per-90 fields (auto-calculated if not provided)
    goals_per90: Optional[float] = None
    assists_per90: Optional[float] = None
    xG_per90: Optional[float] = None
    xA_per90: Optional[float] = None
    total_shots_per90: Optional[float] = None
    shots_on_target_per90: Optional[float] = None
    tackles_per90: Optional[float] = None
    interceptions_per90: Optional[float] = None
    saves_per90: Optional[float] = None
    yellow_cards_per90: Optional[float] = None
    red_cards_per90: Optional[float] = None

    @model_validator(mode="after")
    def compute_per90_metrics(self):
        n90s = self.minutes_played / 90.0 if self.minutes_played > 0 else 0.0
        
        if self.goals_per90 is None:
            self.goals_per90 = self.goals / n90s if n90s > 0 else 0.0
        if self.assists_per90 is None:
            self.assists_per90 = self.assists / n90s if n90s > 0 else 0.0
        if self.xG_per90 is None:
            self.xG_per90 = self.expected_goals / n90s if n90s > 0 else 0.0
        if self.xA_per90 is None:
            self.xA_per90 = self.expected_assists / n90s if n90s > 0 else 0.0
        if self.total_shots_per90 is None:
            self.total_shots_per90 = self.total_shots / n90s if n90s > 0 else 0.0
        if self.shots_on_target_per90 is None:
            self.shots_on_target_per90 = self.shots_on_target / n90s if n90s > 0 else 0.0
        if self.tackles_per90 is None:
            self.tackles_per90 = self.tackles / n90s if n90s > 0 else 0.0
        if self.interceptions_per90 is None:
            self.interceptions_per90 = self.interceptions / n90s if n90s > 0 else 0.0
        if self.saves_per90 is None:
            self.saves_per90 = self.saves / n90s if n90s > 0 else 0.0
        if self.yellow_cards_per90 is None:
            self.yellow_cards_per90 = self.yellow_cards / n90s if n90s > 0 else 0.0
        if self.red_cards_per90 is None:
            self.red_cards_per90 = self.red_cards / n90s if n90s > 0 else 0.0

        return self

    class Config:
        json_schema_extra = {
            "example": {
                "league": "Premier League",
                "position": "F",
                "minutes_played": 2200,
                "appearances": 26,
                "matches_started": 24,
                "rating": 7.4,
                "goals": 14,
                "assists": 6,
                "expected_goals": 13.2,
                "expected_assists": 5.1,
                "total_shots": 68,
                "shots_on_target": 28,
                "tackles": 18,
                "interceptions": 8,
                "saves": 0,
                "yellow_cards": 3,
                "red_cards": 0
            }
        }


class PlayerPredictionResponse(BaseModel):
    predicted_market_value_euros: float = Field(description="Predicted market value in raw Euros (€)")
    formatted_market_value: str = Field(description="Formatted human-readable Euro valuation string")
    status: str = Field(default="success", description="Prediction request status")
