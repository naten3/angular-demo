package com.natenelles.timeapp.util;

import java.util.Optional;
import java.util.stream.Stream;

public class StreamUtils {
    public static <T> Stream<T> optStream(Optional<T> opt) {
        return opt.map(Stream::of).orElse(Stream.empty());
    }
}
