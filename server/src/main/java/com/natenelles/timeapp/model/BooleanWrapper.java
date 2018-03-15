package com.natenelles.timeapp.model;

import java.util.Optional;

public class BooleanWrapper {
  private boolean b;

  public BooleanWrapper() {}

  public BooleanWrapper(final boolean b) {
    this.b = b;
  }

  public boolean isB() {
    return b;
  }

  public void setB(final boolean b) {
    this.b = b;
  }
}
